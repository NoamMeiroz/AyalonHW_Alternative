import { LOAD_RESULT_NOTIFICATION } from './types';

/**
 * return the list of employees for a given comapny.
 */
export const loadResultNotification = (result) => {
    return (dispatch) => {dispatch({ type: LOAD_RESULT_NOTIFICATION, result: result})};
};

