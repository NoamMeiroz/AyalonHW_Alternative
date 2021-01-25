
import {
    QUERY_TIME_SLOT_HOME, QUERY_TIME_SLOT_WORK,
    QUERY_COMPANY, QUERY_LIVING_CITY, QUERY_WORKING_CITY, QUERY_MARK
} from '../actions/types';
const MIN_MARK = -1;
const MAX_MARK = 16;
const INITIAL_STATE = {
    qTimeSlotHomeParams: [],
    qTimeSlotWorkParams: [],
    qCompanyParams: [],
    qSelectedMarks: {
        FINAL_SHORT_HOURS_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_SHIFTING_HOURS_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_BICYCLE_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_SCOOTER_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_PERSONALIZED_SHUTTLE_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_WORK_SHUTTLE_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_CARSHARE_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_CARPOOL_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_CABSHARE_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_PUBLIC_TRANSPORT_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_WALKING_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_WORKING_FROM_HOME_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_SHARED_WORKSPACE_GRADE: [MIN_MARK, MAX_MARK],
        FINAL_SHIFTING_WORKING_DAYS_GRADE: [MIN_MARK, MAX_MARK]
    },
    qLivingCityParams: [],
    qWorkingCityParams: [],
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
        case QUERY_MARK:
            let qSelectedMarks = state.qSelectedMarks;
            qSelectedMarks[action.column] = action.value;
            return {
                ...state,
                qSelectedMarks,
                timestamp: new Date()
            }
        default:
            return state;
    }
}
