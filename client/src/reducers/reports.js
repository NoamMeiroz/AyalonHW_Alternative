
import { QUERY_COMPANY, SETTLEMENT_LIST, SHARE_POTENTIAL } from '../actions/types';

const INITIAL_STATE = {
    errorMessage: '',
    employeesList: [],
    settlementList: [],
    timestamp: new Date()
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case QUERY_COMPANY:
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
