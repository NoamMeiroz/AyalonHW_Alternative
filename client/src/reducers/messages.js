import { ERROR, MESSAGE } from '../actions/types';

const INITIAL_STATE = {
    errorMessage: '',
    timestamp: new Date()
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case ERROR:
            return {
                ...state,
                errorMessage: action.errorMessage,
                errorTimestamp: new Date()
            };
        case MESSAGE:
            return {
                ...state,
                message: action.message,
                timeStamp: new Date()
            };
        default:
            return state;
    }
}
