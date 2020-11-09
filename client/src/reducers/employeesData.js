
import { EMPLOYEES_DATA, CHECK_PROGRESS } from '../actions/types';

const INITIAL_STATE = {
    isSuccess: false,
    errorMessage: '',
    employeesList: [],
    employerID: -1,
    uploadProgess: 0,
    timestamp: new Date()
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case EMPLOYEES_DATA:
            return {
                ...state,
                isSuccess: action.isSuccess,
                employeesList: action.employeesList,
                timestamp: new Date()
            };
        case CHECK_PROGRESS:
            return {
                ...state,
                employerID: action.employerID,
                uploadProgess: action.uploadProgess,
                timestamp: new Date()
            }
        default:
            return state;
    }
}
