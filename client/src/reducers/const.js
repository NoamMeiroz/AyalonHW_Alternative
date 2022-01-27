
import { SETTLEMENT_LIST, TIME_SLOT_TO_HOME, TIME_SLOT_TO_WORK, COMPOUND_LIST } from '../actions/types';

const INITIAL_STATE = {
    timeSlotToWork: [],
    timeSlotToHome: [],
    settlementList: [],
    compoundList: [],
    timestamp: new Date()
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SETTLEMENT_LIST:
            return {
                ...state,
                settlementList: action.settlementList,
                timestamp: new Date()
            };
        case TIME_SLOT_TO_HOME:
            return {
                ...state,
                timeSlotToHome: action.timeSlotList,
                timestamp: new Date()
            };
        case TIME_SLOT_TO_WORK:
            return {
                ...state,
                timeSlotToWork: action.timeSlotList,
                timestamp: new Date()
            };
        case COMPOUND_LIST:
            return {
                ...state,
                compoundList: action.compoundList,
                timestamp: new Date()
            }
        default:
            return state;
    }
}
