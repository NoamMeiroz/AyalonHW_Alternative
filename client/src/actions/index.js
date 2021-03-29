import axios from 'axios';
import { AUTH_USER, AUTH_ERROR, MESSAGE, CONNECTED } from './types';
import * as actionUtils from '../utils/actionsUtil';
import { getSettlementList, getTimeSlotToWork, getTimeSlotToHome } from './const';
import { getEmployees} from './report';
import { getData } from './company';


export * from './report';
export * from './company';
export * from './map';

/**
 * Signin method.If success then store user token localy
 * @param {*} formProps 
 * @param {*} callback 
 */
export const signin = (formProps, callback) => {
    const form = new FormData();
    form.append("userId", formProps.userId);
    form.append("password", formProps.password);
    return (dispatch) => {
        axios.post(`/api/signin/`,
            form,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${form._boundary}`
                }
            }).then(data => {
                dispatch({ type: AUTH_USER, payload: data.data.token, userName: formProps.userId });
                localStorage.setItem('token', data.data.token); // save token use for later
                localStorage.setItem('userName', formProps.userId); // save userName use for later
                dispatch(connected(true));
                callback();
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: AUTH_ERROR, payload: message })
            });
    }
};

/**
 * Signout method. removes token from local store
 */
export const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    return { type: AUTH_USER, payload: '', userName: '' };
}

/**
 * Signout method. removes token from local store
 */
export const connected = (isConnected) => {
    return (dispatch) => {
        if (isConnected){
            dispatch(getEmployees(null,
                null,
                null, null, null));
            dispatch(getData());
            dispatch(getSettlementList());
            dispatch(getTimeSlotToHome());
            dispatch(getTimeSlotToWork());
            dispatch(getSettlementList());

        }
        else 
            dispatch(showMessage("קיימת בעיית תקשורת עם השרת"));
        dispatch({ type: CONNECTED, connected: isConnected });
    }
}


/**
* used to show snakbarMessage
*/
export const showMessage = (message) => {
    return { type: MESSAGE, message: message };
}

