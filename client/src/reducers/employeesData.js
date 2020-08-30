
import { EMPLOYEES_DATA } from '../actions/types';

const INITIAL_STATE = {
    isSuccess: false,
    errorMessage: '',
    employeesList: []

}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case EMPLOYEES_DATA:
            return {...state, 
                isSuccess: action.isSuccess, 
                employeesList: action.employeesList,
                errorMessage: action.errorMessage
            };
        default:
            return state;
    }
}
