
import { FILE_UPLOAD } from '../actions/types';

const INITIAL_STATE = {
    isLoaded: false,
    errorMessage: '',
    timestamp: new Date()
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FILE_UPLOAD:
            let company = action.data;
            return {...state, timestamp: new Date(), isSuccess: true, data: company};
        default:
            return state;
    }
    
}