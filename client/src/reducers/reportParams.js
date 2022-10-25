
import {
    QUERY_TIME_SLOT_HOME, QUERY_TIME_SLOT_WORK,
    QUERY_COMPANY, QUERY_LIVING_CITY, QUERY_WORKING_CITY, QUERY_MARK,
    QUERY_STARTING_POLYGON, QUERY_DESTINATION_POLYGON,
    QUERY_CLUSTRING_BOUNDERY, QUERY_COMPOUNDS
} from '../actions/types';
const MIN_MARK = -1;
const MAX_MARK = 2;
const MAX_CLUSRTER = 30;
const INITIAL_STATE = {
    qTimeSlotHomeParams: [],
    qTimeSlotWorkParams: [],
    qCompanyParams: [],
    qCompoundParams: [],
    qSelectedMarks: {
        FINAL_BICYCLE_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_WORK_SHUTTLE_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_CARPOOL_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_COMPOUND_SHUTTLE_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_PUBLIC_TRANSPORT_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_WALKING_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_WORKING_FROM_HOME_GRADE: [MIN_MARK, MAX_MARK],
    },
    qClusterBoundery: MAX_CLUSRTER,
    qLivingCityParams: [],
    qWorkingCityParams: [],
    qDestinationPolygonParams: {},
    qStartingPolygonParams: {},
    timestamp: new Date()
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case QUERY_TIME_SLOT_HOME:
            return {
                ...state,
                qTimeSlotHomeParams: action.timeSlotList,
                timestamp: new Date()
            };
        case QUERY_TIME_SLOT_WORK:
            return {
                ...state,
                qTimeSlotWorkParams: action.timeSlotList,
                timestamp: new Date()
            };
        case QUERY_COMPANY:
            return {
                ...state,
                qCompanyParams: action.companyList,
                timestamp: new Date()
            };
        case QUERY_LIVING_CITY:
            return {
                ...state,
                qLivingCityParams: action.livingCityList,
                timestamp: new Date()
            };
        case QUERY_WORKING_CITY:
            return {
                ...state,
                qWorkingCityParams: action.workingCityList,
                timestamp: new Date()
            };
        case QUERY_CLUSTRING_BOUNDERY:
            return {
                ...state,
                qClusterBoundery: action.value,
                timestamp: new Date()
            };
        case QUERY_MARK:
            let qSelectedMarks = state.qSelectedMarks;
            qSelectedMarks[action.column] = action.value;
            return {
                ...state,
                qSelectedMarks,
                timestamp: new Date()
            }
        case QUERY_DESTINATION_POLYGON:
            return {
                ...state,
                qDestinationPolygonParams: action.value,
                timestamp: new Date()
            }
        case QUERY_STARTING_POLYGON:
            return {
                ...state,
                qStartingPolygonParams: action.value,
                timestamp: new Date()
            }
        case QUERY_COMPOUNDS:
            return {
                ...state,
                qCompoundParams: action.compoundList,
                timestamp: new Date()
            }
        default:
            return state;
    }
}
