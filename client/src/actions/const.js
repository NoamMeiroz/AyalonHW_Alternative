import axios from 'axios';
import * as actionUtils from '../utils/actionsUtil';
import {
    ERROR, SETTLEMENT_LIST, TIME_SLOT_TO_HOME, TIME_SLOT_TO_WORK, COMPOUND_LIST
} from './types';

export const UPLOAD_IN_PROGRESS = 0;
export const UPLOAD_SUCESS = 1;
export const UPLOAD_FAILED = -1;
const API_SERVER = process.env.REACT_APP_API_SERVER || `/api`;


/**
 * return list of israel settlements
 */
export const getSettlementList = () => {
    return (dispatch) => {
        axios.get(`${API_SERVER}/const/locality`, actionUtils.getAxiosHeader() )
            .then(payload => {
                dispatch({ type: SETTLEMENT_LIST, settlementList: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
}

/**
 * return list of timeSlot to exit for work
 */
export const getTimeSlotToWork = () => {
    return (dispatch) => {
        axios.get(`${API_SERVER}/const/exitToWorkTimeSlots`, actionUtils.getAxiosHeader() )
            .then(payload => {
                dispatch({ type: TIME_SLOT_TO_WORK, timeSlotList: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
}

/**
 * return list of timeSlot to return to home
 */
export const getTimeSlotToHome = () => {
    return (dispatch) => {
        axios.get(`${API_SERVER}/const/returnToHomeTimeSlots`, actionUtils.getAxiosHeader() )
            .then(payload => {
                dispatch({ type: TIME_SLOT_TO_HOME, timeSlotList: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
}

/**
 * return list of compounds
 */
export const getCompundList = () => {
    return (dispatch) => {
        axios.get(`${API_SERVER}/const/compounds`, actionUtils.getAxiosHeader() )
            .then(payload => {
                dispatch({ type: COMPOUND_LIST, compoundList: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
}