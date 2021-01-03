import axios from 'axios';
import {
    QUERY_COMPANY, SETTLEMENT_LIST, SHARE_POTENTIAL, ERROR, MESSAGE
} from './types';
import * as actionUtils from '../utils/actionsUtil';

/**
 * return the list of employees for a given comapny.
 */
export const getEmployees = (employers=[], livingCity=[], workingCity=[]) => {
    let employersList = employers + '';
    let livingCityList = livingCity + '';
    let workingCityList = workingCity + '';
    if (!livingCity)
        livingCityList = '';
    if (!workingCityList)
        workingCityList = '';
    if (!employersList)
        employersList = '';

    let requestConfig = { params: {companies: employersList, livingCity: livingCityList, workingCity: workingCityList}};
    let headers = actionUtils.getAxiosHeader().headers;
    requestConfig = {...requestConfig, headers}
    return (dispatch) => {
        axios.get(`/api/reports/employee`, requestConfig)
            .then(payload => {
                dispatch({ type: QUERY_COMPANY, employeesList: payload.data });
                if (payload.data.length===0)
                    dispatch({type: MESSAGE, message: "לא נמצאו נתונים לחתך הנבחר"});
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
};

/**
 * return list of israel settlements
 */
export const getSettlementList = () => {
    return (dispatch) => {
        axios.get("/api/const/locality", actionUtils.getAxiosHeader() )
            .then(payload => {
                dispatch({ type: SETTLEMENT_LIST, settlementList: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
}

/**
 * return the list of employees for a given comapny.
 */
export const getSharePotential = (employerId) => {
    return (dispatch) => {
        axios.get(`/api/reports/share_potential/employer/${employerId}`,  actionUtils.getAxiosHeader() )
            .then(payload => {
                dispatch({ type: SHARE_POTENTIAL, isSuccess: true, report: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: SHARE_POTENTIAL, isSuccess: false, errorMessage: message });
            });
    }
};