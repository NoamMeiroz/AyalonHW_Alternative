import axios from 'axios';
import {
    AUTH_USER, AUTH_ERROR, FILE_UPLOAD,
    FILE_ERROR, LOAD_DATA, EMPLOYEES_DATA,
    CHECK_PROGRESS_ERROR, CHECK_PROGRESS
} from './types';
import { SERVER } from '../utils/config';

const MAJOR_FAILURE = "בעיה במערכת. נא לנסות מאוחר יותר";

const handleErrorResponse = (response) => {
    switch (response.status) {
        case 400:
            return response.data;
        case 401:
            return "שם משתמש או סיסמה שגויים";
        case 422:
            return "המערכת לא הצליחה ליצור משתמש חדש.";
        case 500:
            return MAJOR_FAILURE;
        default:
            return MAJOR_FAILURE;
    }
};

/**
 * Convert error to meaningfull message
 * @param {Error} error 
 */
export const handleError = (error) => {
    let errorMessage = "";
    if (!error.response) {
        if (error.message)
            if (error.message === "Network Error")
                errorMessage = "קיימת בעיית תקשורת עם השרת";
            else
                errorMessage = error.message;
        else
            errorMessage = "בעיה במערכת";
    }
    else if (error.response.status) {
        errorMessage = handleErrorResponse(error.response);
    }
    else
        errorMessage = MAJOR_FAILURE;
    return errorMessage;
}

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
        axios.post(`${SERVER}/api/signin/`,
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
                let message = handleError(err);
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
 * Upload xlsx file into the server
 * @param {*} file 
 * @param {*} callback 
 */
export const upload = (file, callback) => {
    const form = new FormData();
    form.append("file", file);
    return (dispatch) => {
        axios.post(`${SERVER}/api/employer/upload/`,
            form,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${form._boundary}`
                }
            }).then(data => {
                dispatch({ type: FILE_UPLOAD, isSuccess: true, data: data.data });
                dispatch(checkProgress(data.data.id));
            }).catch(err => {
                let message = handleError(err);
                dispatch({ type: FILE_ERROR, isSuccess: false, errorMessage: message })
            });
    }
};

/**
 * return the company list stores in server
 */
export const getData = () => {
    return (dispatch) => {
        axios.get(`${SERVER}/api/employer/`)
            .then(payload => {
                dispatch({ type: LOAD_DATA, isSuccess: true, sectorList: payload.data.sectors, companyList: payload.data.companies });
            }).catch(err => {
                let message = handleError(err);
                dispatch({ type: LOAD_DATA, isSuccess: false, errorMessage: message, sectorList: {}, companyList: [] });
            });
    }
};

/**
 * return the company list stores in server
 */
export const getEmployeesOfEmployer = (employerId) => {
    return (dispatch) => {
        axios.get(`${SERVER}/api/employer/${employerId}/employee`)
            .then(payload => {
                dispatch({ type: EMPLOYEES_DATA, isSuccess: true, employeesList: payload.data });
            }).catch(err => {
                let message = handleError(err);
                dispatch({ type: EMPLOYEES_DATA, isSuccess: false, errorMessage: message });
            });
    }
};

export const checkProgress = (employerId) => {
    return (dispatch) => {
        axios.get(`${SERVER}/api/employer/${employerId}/employee/precentReady`)
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
                    dispatch({ type: CHECK_PROGRESS_ERROR, errorMessage: message, employerID: employerId });
                }
            }).catch(err => {
                let message = handleError(err);
                dispatch({ type: CHECK_PROGRESS_ERROR, errorMessage: message, employerID: employerId });
            });
    }
};