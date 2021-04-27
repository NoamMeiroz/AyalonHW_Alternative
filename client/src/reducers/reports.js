
import {
    GENERAL_REPORT_RESULT, SETTLEMENT_LIST, SHARE_POTENTIAL,
    CLUSTER_REPORT_RESULT,
    CLUSTER_REPORT_RUN,
    GENERAL_REPORT_RUN,
    DELETE_COMPANY
} from '../actions/types';

const INITIAL_STATE = {
    employeesList: [],
    settlementList: [],
    clusterReport: [],
    isClusterReportRunnig: false,
    isGeneralReportRunnig: false,
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
        case DELETE_COMPANY:
            let tempList = state.employeesList;
            tempList = tempList.filter((employee)=> employee.EMPLOYER_ID !== action.employerID );
            return {
                ...state,
                employeesList: tempList,
                timestamp: new Date()
            };
        case GENERAL_REPORT_RUN:
            return {
                ...state,
                isGeneralReportRunnig: action.isRunning,
                timestamp: new Date()
            };
        case CLUSTER_REPORT_RESULT:
            // sort cluster ascending and descondary by company name.
            var sortedList = action.employeesList.sort((a, b) => {
                // if -1 (no cluster then it is displayed last)
                let clusterA = a.cluster;
                let clusterB = b.cluster;
                if (clusterA === -1)
                    clusterA = 1000000;
                if (clusterB === -1)
                    clusterB = 1000000;
                let result = clusterA - clusterB;
                if (result === 0) {
                    result = a.COMPANY.localeCompare(b.COMPANY);
                }
                return result;
            })
            return {
                ...state,
                clusterReport: sortedList,
                timestamp: new Date()
            };
        case CLUSTER_REPORT_RUN:
            return {
                ...state,
                isClusterReportRunnig: action.isRunning,
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
