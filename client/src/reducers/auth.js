
import { AUTH_USER, AUTH_ERROR } from '../actions/types';

const INITIAL_STATE = {
    authenticated: '',
    userName: '',
    errorMessage: ''
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case AUTH_USER:
            return {...state, authenticated: action.payload, userName: action.userName };
        case AUTH_ERROR:
            return {...state, errorMessage: action.payload };
        default:
            return state;
    }
    
}