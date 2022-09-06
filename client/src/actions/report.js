import axios from 'axios';
import {
    GENERAL_REPORT_RESULT, GENERAL_REPORT_RUN, SHARE_POTENTIAL, ERROR, MESSAGE, QUERY_TIME_SLOT_WORK, QUERY_TIME_SLOT_HOME,
    QUERY_LIVING_CITY, QUERY_WORKING_CITY, QUERY_COMPANY, QUERY_MARK, REPORT_SELECTION,
    QUERY_DESTINATION_POLYGON, QUERY_STARTING_POLYGON, QUERY_CLUSTRING_BOUNDERY, CLUSTER_REPORT_RESULT,
    CLUSTER_REPORT_RUN, QUERY_COMPOUNDS,
} from './types';
import * as actionUtils from '../utils/actionsUtil';


const API_SERVER = process.env.REACT_APP_API_SERVER || `/api`;

/**
 * 
 */
export const setClusterBoundey = (value = 30) => {
    return (dispatch) => {
        dispatch({ type: QUERY_CLUSTRING_BOUNDERY, value: value });
    }
};


/**
 * 
 */
export const setDestinationPolygonQuery = (value = {}) => {
    return (dispatch) => {
        dispatch({ type: QUERY_DESTINATION_POLYGON, value: value });
    }
};

/**
 * 
 */
export const setStartingPolygonQuery = (value = {}) => {
    return (dispatch) => {
        dispatch({ type: QUERY_STARTING_POLYGON, value: value });
    }
};

/**
 * 
 */
export const setMarkQuery = (mark, value = []) => {
    return (dispatch) => {
        dispatch({ type: QUERY_MARK, column: mark, value: value });
    }
};

/**
 * 
 */
export const setQueryLivingCity = (livingCity = []) => {
    return (dispatch) => {
        dispatch({ type: QUERY_LIVING_CITY, livingCityList: livingCity });
    }
};

/**
 * 
 */
export const setQueryCompounds = (compounds = []) => {
    return (dispatch) => {
        dispatch({ type: QUERY_COMPOUNDS, compoundList: compounds });
    }
};



/**
 * 
 */
export const setQueryWorkingCity = (workingCity = []) => {
    return (dispatch) => {
        dispatch({ type: QUERY_WORKING_CITY, workingCityList: workingCity });
    }
};/**
* 

/**
* 
*/
export const setQueryCompany = (company = []) => {
    return (dispatch) => {
        dispatch({ type: QUERY_COMPANY, companyList: company });
    }
};


/**
 * 
 */
export const setQueryTimeSlotToWork = (timeSlotList = []) => {
    return (dispatch) => {
        dispatch({ type: QUERY_TIME_SLOT_WORK, timeSlotList: timeSlotList });
    }
};


/**
 * 
 */
export const setQueryTimeSlotToHome = (timeSlotList = []) => {
    return (dispatch) => {
        dispatch({ type: QUERY_TIME_SLOT_HOME, timeSlotList: timeSlotList });
    }
};

/**
 * return the list of employees for a given comapny.
 */
export const getEmployees = (employers = [], livingCity = [], workingCity = [],
    compounds = [],
    qTimeSlotWork = [], qTimeSlotHome = [], qSelectedMarks = [],
    qDestinationPolygon = {}, qStartingPolygon = {}) => {
    let employersList = employers;
    let livingCityList = livingCity;
    let workingCityList = workingCity;
    let qTimeSlotHomeList = qTimeSlotHome;
    let qTimeSlotWorkList = qTimeSlotWork;
    let qSelectedMarksList = qSelectedMarks;
    let destinationPolygon = qDestinationPolygon;
    let startingPolygon = qStartingPolygon;
    let compoundsList = compounds;
    if (!livingCity)
        livingCityList = [];
    if (!workingCity)
        workingCityList = [];
    if (!employers)
        employersList = [];
    if (!qTimeSlotWork)
        qTimeSlotWorkList = [];
    if (!qTimeSlotHome)
        qTimeSlotHomeList = [];
    if (!qSelectedMarks)
        qSelectedMarksList = [];
    if (!qDestinationPolygon)
        destinationPolygon = {};
    if (!qStartingPolygon)
        startingPolygon = {};
    if (!compounds)
        compoundsList = [];

    let data = {
        companies: employersList,
        livingCity: livingCityList,
        workingCity: workingCityList,
        timeSlotHome: qTimeSlotHomeList,
        timeSlotWork: qTimeSlotWorkList,
        marks: qSelectedMarksList,
        destinationPolygon: destinationPolygon,
        startingPolygon: startingPolygon,
        compounds: compoundsList
    };
    let headers = actionUtils.getAxiosHeader().headers;
    headers = { ...{ 'Content-Type': 'application/json' }, headers }
    return (dispatch) => {
        dispatch({ type: GENERAL_REPORT_RUN, isRunning: true });
        axios.post(`${API_SERVER}/reports/employee`, data, headers)
            .then(payload => {
                dispatch({ type: GENERAL_REPORT_RUN, isRunning: false });
                dispatch({ type: GENERAL_REPORT_RESULT, employeesList: payload.data });
                if (payload.data.length === 0)
                    dispatch({ type: MESSAGE, message: "לא נמצאו נתונים לחתך הנבחר" });
                dispatch({ type: GENERAL_REPORT_RUN, isRunning: false });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
                dispatch({ type: GENERAL_REPORT_RUN, isRunning: false });
            });
    }
};


/**
 * return the list of employees for a given comapny.
 */
export const calculateCluster = (employers = [], livingCity = [], workingCity = [],
    compounds = [],
    qTimeSlotWork = [], qTimeSlotHome = [], qSelectedMarks = [],
    qDestinationPolygon = {}, qStartingPolygon = {}, qClusterBoundery = []) => {
    let employersList = employers;
    let livingCityList = livingCity;
    let workingCityList = workingCity;
    let qTimeSlotHomeList = qTimeSlotHome;
    let qTimeSlotWorkList = qTimeSlotWork;
    let qSelectedMarksList = qSelectedMarks;
    let destinationPolygon = qDestinationPolygon;
    let startingPolygon = qStartingPolygon;
    let compoundsList = compounds;

    if (!livingCity)
        livingCityList = [];
    if (!workingCity)
        workingCityList = [];
    if (!employers)
        employersList = [];
    if (!qTimeSlotWork)
        qTimeSlotWorkList = [];
    if (!qTimeSlotHome)
        qTimeSlotHomeList = [];
    if (!qSelectedMarks)
        qSelectedMarksList = [];
    if (!qDestinationPolygon)
        destinationPolygon = {};
    if (!qStartingPolygon)
        startingPolygon = {};
    if (!compounds)
        compoundsList = [];

    let data = {
        companies: employersList,
        livingCity: livingCityList,
        workingCity: workingCityList,
        timeSlotHome: qTimeSlotHomeList,
        timeSlotWork: qTimeSlotWorkList,
        marks: qSelectedMarksList,
        destinationPolygon: destinationPolygon,
        startingPolygon: startingPolygon,
        clusterBoundery: qClusterBoundery,
        compounds: compoundsList
    };
    let headers = actionUtils.getAxiosHeader().headers;
    headers = { ...{ 'Content-Type': 'application/json' }, headers }

    // update list of employees
    return (dispatch) => {
        dispatch({ type: CLUSTER_REPORT_RUN, isRunning: true });
        dispatch(getEmployees(employers, livingCity, workingCity,
            compoundsList,
            qTimeSlotWork, qTimeSlotHome, qSelectedMarks,
            qDestinationPolygon, qStartingPolygon));
        axios.post(`${API_SERVER}/reports/cluster`, data, headers)
            .then(payload => {
                dispatch({ type: CLUSTER_REPORT_RUN, isRunning: false });
                dispatch({ type: CLUSTER_REPORT_RESULT, employeesList: payload.data });
                if (payload.data.length === 0)
                    dispatch({ type: MESSAGE, message: "לא נמצאו נתונים לחתך הנבחר" });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
                dispatch({ type: CLUSTER_REPORT_RUN, isRunning: false });
            });
    }
};

/**
 * return the list of employees for a given comapny.
 */
export const clearClusterReport = () => {
    return (dispatch) => {
        dispatch({ type: CLUSTER_REPORT_RESULT, employeesList: [] });
    }
};


/**
 * return the list of employees for a given comapny.
 */
export const getSharePotential = (employerId) => {
    return (dispatch) => {
        axios.get(`${API_SERVER}/reports/share_potential/employer/${employerId}`, actionUtils.getAxiosHeader())
            .then(payload => {
                dispatch({ type: SHARE_POTENTIAL, isSuccess: true, report: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: SHARE_POTENTIAL, isSuccess: false, errorMessage: message });
            });
    }
};

/**
 * 
 */
export const setReportType = (reportType) => {
    return (dispatch, getState) => {
        dispatch({ type: REPORT_SELECTION, reportsData: getState().reports, reportType: reportType });
    }
};