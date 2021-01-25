import React from 'react';
import createClass from 'create-react-class';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import './index.css';
import App from './components/App';
import Welcome from './components/Welcome';
import SignIn from './components/auth/SignIn';
import Companies from './components/companies/Companies';
import MapTabsPanel from './components/gis/MapTabsPanel';
import SharePotential from './components/reports/SharePotential';
import InfoPanel from './components/dashboard/InfoPanel';
import reducers from './reducers';
import SignOut from './components/auth/SignOut';

const store = createStore(
	reducers,
	{
		auth: { authenticated: localStorage.getItem('token'),
				userName: localStorage.getItem('userName') }
	},
	applyMiddleware(reduxThunk)
);

const getMainComponent = (children) => {
	return createClass({
		render() {
			return (<div className="main_area"><InfoPanel></InfoPanel>
				<div className="border">{children}</div>
			</div>);
		}
	});
}

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App>
				<Switch>
					<Route path="/signin" exact component={SignIn} />
					<Route path="/companies" exact component={getMainComponent(<Companies />)} />
					<Route path="/map" exact component={MapTabsPanel} />
					<Route path="/reports/share_potential" exact component={getMainComponent(<SharePotential />)} />
					<Route path="/signout" exact component={SignOut} />
					<Route path="/" component={Welcome} />
				</Switch>
			</App>
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);