import axios from 'axios';
import * as actionUtils from '../utils/actionsUtil';
import {
    ERROR, SETTLEMENT_LIST, TIME_SLOT_TO_HOME, TIME_SLOT_TO_WORK
} from './types';

export const UPLOAD_IN_PROGRESS = 0;
export const UPLOAD_SUCESS = 1;
export const UPLOAD_FAILED = -1;


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
 * return list of timeSlot to exit for work
 */
export const getTimeSlotToWork = () => {
    return (dispatch) => {
        axios.get("/api/const/exitToWorkTimeSlots", actionUtils.getAxiosHeader() )
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
        axios.get("/api/const/returnToHomeTimeSlots", actionUtils.getAxiosHeader() )
            .then(payload => {
                dispatch({ type: TIME_SLOT_TO_HOME, timeSlotList: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
}