
import { EMPLOYEES_DATA, CHECK_PROGRESS, CHECK_PROGRESS_ERROR } from '../actions/types';

const INITIAL_STATE = {
    isSuccess: false,
    errorMessage: '',
    employeesList: [],
    employerID: -1,
    uploadProgess: 0
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case EMPLOYEES_DATA:
            return {
                ...state,
                isSuccess: action.isSuccess,
                employeesList: action.employeesList,
                errorMessage: action.errorMessage
            };
        case CHECK_PROGRESS:
            return {
                ...state,
                employerID: action.employerID,
                uploadProgess: action.uploadProgess,
                errorMessage: ""
            }
        case CHECK_PROGRESS_ERROR:
            return {
                ...state,
                employerID: action.employerID,
                uploadProgess: 100,
                errorMessage: action.errorMessage
            }
        default:
            return state;
    }
}
