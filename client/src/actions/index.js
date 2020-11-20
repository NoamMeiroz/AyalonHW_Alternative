import axios from 'axios';
import {
    AUTH_USER, AUTH_ERROR, FILE_UPLOAD,
    LOAD_DATA, EMPLOYEES_DATA,
    CHECK_PROGRESS, ERROR, MESSAGE
} from './types';
import * as actionUtils from '../utils/actionsUtil';

export * from './report';
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
                dispatch({ type: AUTH_USER, payload: data.data.token });
                localStorage.setItem('token', data.data.token); // save token use for later
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
    return { type: AUTH_USER, payload: '' };
}

/**
* used to show snakbarMessage
*/
export const showMessage = (message) => {
    return { type: MESSAGE, message: message };
}

/**
 * Upload xlsx file into the server
 * @param {*} file 
 * @param {*} callback 
 */
export const upload = (file, callback) => {
    const form = new FormData();
    form.append("file", file);
    return (dispatch) => {
        axios.post(`/api/employer/upload/`,
            form,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
                    'authorization': localStorage.getItem('token')
                }
            }).then(data => {
                dispatch({ type: FILE_UPLOAD, isSuccess: true, data: data.data });
                dispatch(checkProgress(data.data.id));
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message })
            });
    }
};

/**
 * return the company list stores in server
 */
export const getData = () => {
    return (dispatch) => {
        axios.get(`/api/employer/`, actionUtils.getAxiosHeader())
            .then(payload => {
                dispatch({ type: LOAD_DATA, isSuccess: true, sectorList: payload.data.sectors, companyList: payload.data.companies });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message, sectorList: {}, companyList: [] });
            });
    }
};

/**
 * return the company list stores in server
 */
export const getEmployeesOfEmployer = (employerId) => {
    return (dispatch) => {
        axios.get(`/api/employer/${employerId}/employee`, actionUtils.getAxiosHeader())
            .then(payload => {
                dispatch({ type: EMPLOYEES_DATA, isSuccess: true, employeesList: payload.data });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
};

export const checkProgress = (employerId) => {
    return (dispatch) => {
        axios.get(`/api/employer/${employerId}/employee/precentReady`, actionUtils.getAxiosHeader())
            .then(payload => {
                if (payload.data.precent || payload.data.precent >= 0) {
                    dispatch({
                        type: CHECK_PROGRESS,
                        employerID: payload.data.employerID,
                        uploadProgess: payload.data.precent
                    });
                }
                else {
                    let message = "בעיה במערכת, תשובה מהשרת לא תקינה";
                    dispatch({ type: ERROR, errorMessage: message, employerID: employerId });
                    dispatch({
                        type: CHECK_PROGRESS,
                        employerID: payload.data.employerID,
                        uploadProgess: 100
                    });
                }
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message, employerID: employerId });
                dispatch({
                    type: CHECK_PROGRESS,
                    employerID: employerId,
                    uploadProgess: 100
                });
            });
    }
};