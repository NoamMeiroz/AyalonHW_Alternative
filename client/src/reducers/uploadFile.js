
import { FILE_UPLOAD, FILE_ERROR } from '../actions/types';

const INITIAL_STATE = {
    isLoaded: false,
    errorMessage: '',
    timestamp: new Date()
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FILE_UPLOAD:
            return {...state, timestamp: new Date(), isSuccess: true, data: action.data };
        case FILE_ERROR:
            return {...state, timestamp: new Date(), errorMessage: action.errorMessage, isSuccess: false };
        default:
            return state;
    }
    
}