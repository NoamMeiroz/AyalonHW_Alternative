import axios from 'axios';
import {
    ERROR,
    SOLUTION_MARKS_LIST,
    SOLUTION_PROPERTIES_VALUES_LIST
} from './types';
import * as actionUtils from '../utils/actionsUtil';

const API_SERVER = process.env.REACT_APP_API_SERVER || `/api`;

/**
 * return the solution marks list from server
 */
 export const getSolutionMarks = () => {
    return (dispatch) => {
        axios.get(`${API_SERVER}/algosetting/solutionMarks`, actionUtils.getAxiosHeader())
            .then(payload => {
                dispatch({ type: SOLUTION_MARKS_LIST, isSuccess: true, solutionMarks: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message, solutionMarks: [] });
            });
    }
};

/**
 * return the solution properties values from server
 */
 export const getSolutionPropertiesValues = () => {
    return (dispatch) => {
        axios.get(`${API_SERVER}/algosetting/solutionPropertiesValues`, actionUtils.getAxiosHeader())
            .then(payload => {
                dispatch({ type: SOLUTION_PROPERTIES_VALUES_LIST, isSuccess: true, solutionPropertiesValues: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message, solutionPropertiesValues: [] });
            });
    }
};

/**
 * update a solution makr
 */
 export const setSolutionMark = (newSolutionMark) => {
    let headers = actionUtils.getAxiosHeader().headers;
    headers = { ...{ 'Content-Type': 'application/json' }, headers }
    const data = { id: newSolutionMark.id,
        AVG_AGREEMENT: newSolutionMark.AVG_AGREEMENT,
        MULTI: newSolutionMark.MULTI,
        POSITIVE_MARK: newSolutionMark.POSITIVE_MARK,
        NEGATIVE_MARK: newSolutionMark.NEGATIVE_MARK,
        NUETRAL_MARK: newSolutionMark.NUETRAL_MARK,
        DISQUALIFIED_MARK: newSolutionMark.DISQUALIFIED_MARK
    }
    return (dispatch) => {
        axios.post(`${API_SERVER}/algosetting/solutionMarks`, data, headers)
            .then(payload => {
                return;
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message, solutionMarks: [] });
            });
    }
};

/**
 * update a solution makr
 */
 export const setSolutionPropertyValue   = (newSolutioPropertyValue) => {
    let headers = actionUtils.getAxiosHeader().headers;
    headers = { ...{ 'Content-Type': 'application/json' }, headers }
    const data = { id: newSolutioPropertyValue.id,
        VALUE: newSolutioPropertyValue.VALUE
    }
    return (dispatch) => {
        axios.post(`${API_SERVER}/algosetting/solutionPropertyValue`, data, headers)
            .then(payload => {
                return;
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message, solutionMarks: [] });
            });
    }
};

