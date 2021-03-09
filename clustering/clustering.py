import warnings
import numpy as np
import scipy.sparse as sp
from sklearn.metrics.pairwise import euclidean_distances
from sklearn.utils.extmath import row_norms, squared_norm, cartesian
from sklearn.utils.validation import check_array, check_random_state, as_float_array, check_is_fitted
from joblib import Parallel
from joblib import delayed
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import sklearn.preprocessing as preprocessing
import json
import sys
import traceback
from json_schema import json_schema

# Internal scikit learn methods imported into this project
from k_means_constrained.sklearn_import.cluster._k_means import _centers_dense, _centers_sparse
from k_means_constrained.sklearn_import.cluster.k_means_ import _validate_center_shape, _tolerance, KMeans, \
    _init_centroids

from k_means_constrained.mincostflow_vectorized import SimpleMinCostFlowVectorized


def k_means_constrained(X, n_clusters, size_min=None, size_max=None, init='k-means++',
                        n_init=10, max_iter=300, verbose=False,
                        tol=1e-4, random_state=None, copy_x=True, n_jobs=1,
                        return_n_iter=False):
    if sp.issparse(X):
        raise NotImplementedError("Not implemented for sparse X")

    if n_init <= 0:
        raise ValueError("Invalid number of initializations."
                         " n_init=%d must be bigger than zero." % n_init)
    random_state = check_random_state(random_state)

    if max_iter <= 0:
        raise ValueError('Number of iterations should be a positive number,'
                         ' got %d instead' % max_iter)

    X = as_float_array(X, copy=copy_x)
    tol = _tolerance(X, tol)

    # Validate init array
    if hasattr(init, '__array__'):
        init = check_array(init, dtype=X.dtype.type, copy=True)
        _validate_center_shape(X, n_clusters, init)

        if n_init != 1:
            warnings.warn(
                'Explicit initial center position passed: '
                'performing only one init in k-means instead of n_init=%d'
                % n_init, RuntimeWarning, stacklevel=2)
            n_init = 1

    # subtract of mean of x for more accurate distance computations
    if not sp.issparse(X):
        X_mean = X.mean(axis=0)
        # The copy was already done above
        X -= X_mean

        if hasattr(init, '__array__'):
            init -= X_mean

    # precompute squared norms of data points
    x_squared_norms = row_norms(X, squared=True)

    best_labels, best_inertia, best_centers = None, None, None

    if n_jobs == 1:
        # For a single thread, less memory is needed if we just store one set
        # of the best results (as opposed to one set per run per thread).
        for it in range(n_init):
            # run a k-means once
            labels, inertia, centers, n_iter_ = kmeans_constrained_single(
                X, n_clusters,
                size_min=size_min, size_max=size_max,
                max_iter=max_iter, init=init, verbose=verbose, tol=tol,
                x_squared_norms=x_squared_norms, random_state=random_state)
            # determine if these results are the best so far
            if best_inertia is None or inertia < best_inertia:
                best_labels = labels.copy()
                best_centers = centers.copy()
                best_inertia = inertia
                best_n_iter = n_iter_
    else:
        # parallelisation of k-means runs
        seeds = random_state.randint(np.iinfo(np.int32).max, size=n_init)
        results = Parallel(n_jobs=n_jobs, verbose=0)(
            delayed(kmeans_constrained_single)(X, n_clusters,
                                               size_min=size_min, size_max=size_max,
                                               max_iter=max_iter, init=init,
                                               verbose=verbose, tol=tol,
                                               x_squared_norms=x_squared_norms,
                                               # Change seed to ensure variety
                                               random_state=seed)
            for seed in seeds)
        # Get results with the lowest inertia
        labels, inertia, centers, n_iters = zip(*results)
        best = np.argmin(inertia)
        best_labels = labels[best]
        best_inertia = inertia[best]
        best_centers = centers[best]
        best_n_iter = n_iters[best]

    if not sp.issparse(X):
        if not copy_x:
            X += X_mean
        best_centers += X_mean

    if return_n_iter:
        return best_centers, best_labels, best_inertia, best_n_iter
    else:
        return best_centers, best_labels, best_inertia


def kmeans_constrained_single(X, n_clusters, size_min=None, size_max=None,
                              max_iter=300, init='k-means++',
                              verbose=False, x_squared_norms=None,
                              random_state=None, tol=1e-4):

    if sp.issparse(X):
        raise NotImplementedError("Not implemented for sparse X")

    random_state = check_random_state(random_state)
    n_samples = X.shape[0]

    best_labels, best_inertia, best_centers = None, None, None
    # init
    centers = _init_centroids(X, n_clusters, init, random_state=random_state, x_squared_norms=x_squared_norms)
    if verbose:
        print("Initialization complete")

    # Allocate memory to store the distances for each sample to its
    # closer center for reallocation in case of ties
    distances = np.zeros(shape=(n_samples,), dtype=X.dtype)

    # Determine min and max sizes if non given
    if size_min is None:
        size_min = 0
    if size_max is None:
        size_max = n_samples  # Number of data points

    # Check size min and max
    if not ((size_min >= 0) and (size_min <= n_samples)
            and (size_max >= 0) and (size_max <= n_samples)):
        raise ValueError("size_min and size_max must be a positive number smaller "
                         "than the number of data points or `None`")
    if size_max < size_min:
        raise ValueError("size_max must be larger than size_min")
    if size_min * n_clusters > n_samples:
        raise ValueError("The product of size_min and n_clusters cannot exceed the number of samples (X)")

    # iterations
    for i in range(max_iter):
        centers_old = centers.copy()
        # labels assignment is also called the E-step of EM
        labels, inertia = \
            _labels_constrained(X, centers, size_min, size_max, distances=distances)

        # computation of the means is also called the M-step of EM
        if sp.issparse(X):
            centers = _centers_sparse(X, labels, n_clusters, distances)
        else:
            centers = _centers_dense(X, labels, n_clusters, distances)

        if verbose:
            print("Iteration %2d, inertia %.3f" % (i, inertia))

        if best_inertia is None or inertia < best_inertia:
            best_labels = labels.copy()
            best_centers = centers.copy()
            best_inertia = inertia

        center_shift_total = squared_norm(centers_old - centers)
        if center_shift_total <= tol:
            if verbose:
                print("Converged at iteration %d: "
                      "center shift %e within tolerance %e"
                      % (i, center_shift_total, tol))
            break

    if center_shift_total > 0:
        # rerun E-step in case of non-convergence so that predicted labels
        # match cluster centers
        best_labels, best_inertia = \
            _labels_constrained(X, centers, size_min, size_max, distances=distances)

    return best_labels, best_inertia, best_centers, i + 1


def _labels_constrained(X, centers, size_min, size_max, distances):
    C = centers

    # Distances to each centre C. (the `distances` parameter is the distance to the closest centre)
    # K-mean original uses squared distances but this equivalent for constrained k-means
    D = euclidean_distances(X, C, squared=False)

    edges, costs, capacities, supplies, n_C, n_X = minimum_cost_flow_problem_graph(X, C, D, size_min, size_max)
    labels = solve_min_cost_flow_graph(edges, costs, capacities, supplies, n_C, n_X)

    # cython k-means M step code assumes int32 inputs
    labels = labels.astype(np.int32)

    # Change distances in-place
    distances[:] = D[np.arange(D.shape[0]), labels] ** 2  # Square for M step of EM
    inertia = distances.sum()

    return labels, inertia


def minimum_cost_flow_problem_graph(X, C, D, size_min, size_max):
    # Setup minimum cost flow formulation graph
    # Vertices indexes:
    # X-nodes: [0, n(x)-1], C-nodes: [n(X), n(X)+n(C)-1], C-dummy nodes:[n(X)+n(C), n(X)+2*n(C)-1],
    # Artificial node: [n(X)+2*n(C), n(X)+2*n(C)+1-1]

    # Create indices of nodes
    n_X = X.shape[0]
    n_C = C.shape[0]
    X_ix = np.arange(n_X)
    C_dummy_ix = np.arange(X_ix[-1] + 1, X_ix[-1] + 1 + n_C)
    C_ix = np.arange(C_dummy_ix[-1] + 1, C_dummy_ix[-1] + 1 + n_C)
    art_ix = C_ix[-1] + 1

    # Edges
    edges_X_C_dummy = cartesian([X_ix, C_dummy_ix])  # All X's connect to all C dummy nodes (C')
    edges_C_dummy_C = np.stack([C_dummy_ix, C_ix], axis=1)  # Each C' connects to a corresponding C (centroid)
    edges_C_art = np.stack([C_ix, art_ix * np.ones(n_C)], axis=1)  # All C connect to artificial node

    edges = np.concatenate([edges_X_C_dummy, edges_C_dummy_C, edges_C_art])

    # Costs
    costs_X_C_dummy = D.reshape(D.size)
    costs = np.concatenate([costs_X_C_dummy, np.zeros(edges.shape[0] - len(costs_X_C_dummy))])

    # Capacities - can set for max-k
    capacities_C_dummy_C = size_max * np.ones(n_C)
    cap_non = n_X  # The total supply and therefore wont restrict flow
    capacities = np.concatenate([
        np.ones(edges_X_C_dummy.shape[0]),
        capacities_C_dummy_C,
        cap_non * np.ones(n_C)
    ])

    # Sources and sinks
    supplies_X = np.ones(n_X)
    supplies_C = -1 * size_min * np.ones(n_C)  # Demand node
    supplies_art = -1 * (n_X - n_C * size_min)  # Demand node
    supplies = np.concatenate([
        supplies_X,
        np.zeros(n_C),  # C_dummies
        supplies_C,
        [supplies_art]
    ])

    # All arrays must be of int dtype for `SimpleMinCostFlow`
    edges = edges.astype('int32')
    costs = np.around(costs * 1000, 0).astype('int32')  # Times by 1000 to give extra precision
    capacities = capacities.astype('int32')
    supplies = supplies.astype('int32')

    return edges, costs, capacities, supplies, n_C, n_X


def solve_min_cost_flow_graph(edges, costs, capacities, supplies, n_C, n_X):
    # Instantiate a SimpleMinCostFlow solver.
    min_cost_flow = SimpleMinCostFlowVectorized()

    if (edges.dtype != 'int32') or (costs.dtype != 'int32') \
            or (capacities.dtype != 'int32') or (supplies.dtype != 'int32'):
        raise ValueError("`edges`, `costs`, `capacities`, `supplies` must all be int dtype")

    N_edges = edges.shape[0]
    N_nodes = len(supplies)

    # Add each edge with associated capacities and cost
    min_cost_flow.AddArcWithCapacityAndUnitCostVectorized(edges[:, 0], edges[:, 1], capacities, costs)

    # Add node supplies
    min_cost_flow.SetNodeSupplyVectorized(np.arange(N_nodes, dtype='int32'), supplies)

    # Find the minimum cost flow between node 0 and node 4.
    if min_cost_flow.Solve() != min_cost_flow.OPTIMAL:
        raise Exception('There was an issue with the min cost flow input.')

    # Assignment
    labels_M = min_cost_flow.FlowVectorized(np.arange(n_X * n_C, dtype='int32')).reshape(n_X, n_C)

    labels = labels_M.argmax(axis=1)
    return labels


class KMeansConstrained(KMeans):
    def __init__(self, n_clusters=8, size_min=None, size_max=None, init='k-means++', n_init=10, max_iter=300, tol=1e-4,
                 verbose=False, random_state=None, copy_x=True, n_jobs=1):

        self.size_min = size_min
        self.size_max = size_max

        super().__init__(n_clusters=n_clusters, init=init, n_init=n_init, max_iter=max_iter, tol=tol,
                         verbose=verbose, random_state=random_state, copy_x=copy_x, n_jobs=n_jobs)

    def fit(self, X, y=None):
        if sp.issparse(X):
            raise NotImplementedError("Not implemented for sparse X")

        random_state = check_random_state(self.random_state)
        X = self._check_fit_data(X)

        self.cluster_centers_, self.labels_, self.inertia_, self.n_iter_ = \
            k_means_constrained(
                X, n_clusters=self.n_clusters,
                size_min=self.size_min, size_max=self.size_max,
                init=self.init,
                n_init=self.n_init, max_iter=self.max_iter, verbose=self.verbose,
                tol=self.tol, random_state=random_state, copy_x=self.copy_x,
                n_jobs=self.n_jobs,
                return_n_iter=True)
        return self

    def predict(self, X, size_min='init', size_max='init'):
        if sp.issparse(X):
            raise NotImplementedError("Not implemented for sparse X")

        if size_min == 'init':
            size_min = self.size_min
        if size_max == 'init':
            size_max = self.size_max

        n_clusters = self.n_clusters
        n_samples = X.shape[0]

        check_is_fitted(self, 'cluster_centers_')

        X = self._check_test_data(X)

        # Allocate memory to store the distances for each sample to its
        # closer center for reallocation in case of ties
        distances = np.zeros(shape=(n_samples,), dtype=X.dtype)

        # Determine min and max sizes if non given
        if size_min is None:
            size_min = 0
        if size_max is None:
            size_max = n_samples  # Number of data points

        # Check size min and max
        if not ((size_min >= 0) and (size_min <= n_samples)
                and (size_max >= 0) and (size_max <= n_samples)):
            raise ValueError("size_min and size_max must be a positive number smaller "
                             "than the number of data points or `None`")
        if size_max < size_min:
            raise ValueError("size_max must be larger than size_min")
        if size_min * n_clusters > n_samples:
            raise ValueError("The product of size_min and n_clusters cannot exceed the number of samples (X)")

        labels, inertia = \
            _labels_constrained(X, self.cluster_centers_, size_min, size_max, distances=distances)

        return labels

    def fit_predict(self, X, y=None):
        return self.fit(X).labels_


try:
    # check input
    schema = '{"maxCluster": "int", "employees": [{"id": "int", "EMPLOYER_ID": "int", "WORKER_ID": "int", "X": "float|int", "Y": "float|int"}, "..."]}'
    if json_schema.match(sys.argv[1],schema):
        # parse input
        parsedInput = json.loads(sys.argv[1])
        # validate maxCluster as positive int
        if (not isinstance(parsedInput['maxCluster'],int)) or (parsedInput['maxCluster'] < 0):
            raise TypeError('maxCluster must be a positive integer')
        if (len(parsedInput['employees']) < 2):
            raise ValueError('Input must include more than one employee')
    else:
        raise TypeError('Input does not comply with the required schema')

    # create data frame
    employees = pd.DataFrame(parsedInput['employees'])
    # preproccessing
    scaled = preprocessing.scale(employees[['X','Y']])
    # choose K
    silhouette_scores = []
    for k in range(1,len(scaled)):
        try:
            kmeans_per_k = KMeansConstrained(n_clusters=k,
                                             random_state=42,
                                             size_max = parsedInput['maxCluster'])
            kmeans_per_k.fit_predict(scaled)
            silhouette_scores.append(silhouette_score(scaled,kmeans_per_k.labels_))
        except:
            silhouette_scores.append(0)     
    k_clusters = np.argmax(silhouette_scores) + 1

    # run model
    kmeans_output = KMeansConstrained(n_clusters=k_clusters,
                                             random_state=42,
                                             size_max = parsedInput['maxCluster'])
    # fit model
    kmeans_output.fit_predict(scaled)

    # assign 
    employees = employees.assign(cluster = kmeans_output.labels_)

    # eliminate clusters with less than 3 employees
    employees.loc[employees.cluster.isin(employees.cluster.value_counts()[employees.cluster.value_counts()<3].index),'cluster'] = -1

    # print
    print(employees.to_json(orient="records"))

except:
    # codes and messages
    codes = {'Input does not comply with the required schema':3000,
            'maxCluster must be a positive integer':3001,

            'Input must include more than one employee':3011}
    
    # get error elements
    errorObj = sys.exc_info()
    code = 0
    errString = str(errorObj[1])

    # iterate over the dictionary
    for message in codes:
        if errString.find(message) != -1:
            code = codes[message]
            break

    # generate error object
    errorOutput = {'code':code, 'message':errString, 'trace':str(traceback.format_exc())}
    
    # print
    print(json.dumps(errorOutput))
