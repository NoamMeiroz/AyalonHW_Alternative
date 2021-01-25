import axios from 'axios';
import {
    GENERAL_REPORT_RESULT, SHARE_POTENTIAL, ERROR, MESSAGE, QUERY_TIME_SLOT_WORK, QUERY_TIME_SLOT_HOME,
    QUERY_LIVING_CITY, QUERY_WORKING_CITY, QUERY_COMPANY, QUERY_MARK, REPORT_SELECTION
} from './types';
import * as actionUtils from '../utils/actionsUtil';

/**
 * 
 */
export const setMarkQuery = (mark, value=[]) => {
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
    qTimeSlotWork = [], qTimeSlotHome = [], qSelectedMarks=[]) => {
    let employersList = employers;
    let livingCityList = livingCity;
    let workingCityList = workingCity;
    let qTimeSlotHomeList = qTimeSlotHome;
    let qTimeSlotWorkList = qTimeSlotWork;
    let qSelectedMarksList = qSelectedMarks;
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

    let data = {
            companies: employersList,
            livingCity: livingCityList,
            workingCity: workingCityList,
            timeSlotHome: qTimeSlotHomeList,
            timeSlotWork: qTimeSlotWorkList,
            marks: qSelectedMarksList
    };
    let headers = actionUtils.getAxiosHeader().headers;
    headers = { ...{'Content-Type': 'application/json'}, headers }
    return (dispatch) => {
        axios.post(`/api/reports/employee`, data, headers)  
            .then(payload => {
                dispatch({ type: GENERAL_REPORT_RESULT, employeesList: payload.data });
                if (payload.data.length === 0)
                    dispatch({ type: MESSAGE, message: "לא נמצאו נתונים לחתך הנבחר" });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
};

/**
 * return the list of employees for a given comapny.
 */
export const getSharePotential = (employerId) => {
    return (dispatch) => {
        axios.get(`/api/reports/share_potential/employer/${employerId}`, actionUtils.getAxiosHeader())
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
    return (dispatch,getState) => {
        dispatch({ type: REPORT_SELECTION, origData: getState().reports.employeesList, reportType: reportType });
    }
};