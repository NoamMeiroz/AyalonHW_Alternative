import { LOAD_RESULT_NOTIFICATION } from '../actions/types';

const INITIAL_STATE = {
    result: {}
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOAD_RESULT_NOTIFICATION:
            return {
                ...state,
                result: action.result,
                timestamp: new Date()
            };
        default:
            return state;
    }
}
