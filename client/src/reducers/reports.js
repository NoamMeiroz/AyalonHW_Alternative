
import { GENERAL_REPORT_RESULT, SETTLEMENT_LIST, SHARE_POTENTIAL } from '../actions/types';

const INITIAL_STATE = {
    employeesList: [],
    settlementList: [],
    timestamp: new Date()
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case GENERAL_REPORT_RESULT:
            return {
                ...state,
                employeesList: action.employeesList,
                timestamp: new Date()
            };
        case SHARE_POTENTIAL:
            return {
                ...state,
                sharePotential: action.report,
                timestamp: new Date()
            };
        case SETTLEMENT_LIST:
            
            return {
                ...state,
                settlementList: action.settlementList,
                timestamp: new Date()
            };
        default:
            return state;
    }
}
