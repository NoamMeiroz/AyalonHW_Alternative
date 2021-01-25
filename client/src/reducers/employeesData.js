
import { EMPLOYEES_DATA } from '../actions/types';

const INITIAL_STATE = {
    employeesList: [],
    employerID: -1,
    timestamp: new Date()
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case EMPLOYEES_DATA:
            return {
                ...state,
                employeesList: action.employeesList,
                timestamp: new Date()
            };
        default:
            return state;
    }
}
