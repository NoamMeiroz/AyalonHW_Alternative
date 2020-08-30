
import { FILE_UPLOAD, FILE_ERROR } from '../actions/types';

const INITIAL_STATE = {
    isLoaded: false,
    errorMessage: ''
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FILE_UPLOAD:
            return {...state, isLoaded: true, data: action.data };
        case FILE_ERROR:
            return {...state, errorMessage: action.errorMessage, isLoaded: false };
        default:
            return state;
    }
    
}