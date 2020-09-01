import axios from 'axios';
import {
    AUTH_USER, AUTH_ERROR, FILE_UPLOAD,
    FILE_ERROR, LOAD_DATA, EMPLOYEES_DATA,
    CHECK_PROGRESS_ERROR, CHECK_PROGRESS
} from './types';
import { SERVER } from '../utils/config';

const handleError = (status) => {
    switch (status) {
        case 401:
            return "שם משתמש או סיסמה שגויים";
        default:
            return "בעיה במערכת. נא לנסות מאוחר יותר";
    }
};

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
                dispatch({ type: AUTH_ERROR, payload: handleError(err.response.status) })
            });
    }
};

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
                let message = "";
                if (!err.response) {
                    message = "יש בעיה באתר";
                }
                else if (err.response.status === 500) {
                    message = "טעינת קובץ נכשלה עקב בעיה במערכת";
                }
                else
                    message = err.response.data;
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
                let message = "";
                if (!err.response)
                    message = err;
                else if (err.response.status === 500) {
                    message = "בעיה במערכת";
                }
                else
                    message = err.response.data;
                dispatch({ type: LOAD_DATA, isSuccess: false, errorMessage: message });
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
                let message = "";
                if (err.response.status === 500) {
                    message = "בעיה במערכת";
                }
                else
                    message = err.response.data;
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
                    let errorMessage = "בעיה במערכת, תשובה מהשרת לא תקינה";
                    dispatch({ type: CHECK_PROGRESS_ERROR, error: errorMessage });
                }
            }).catch(err => {
                let errorMessage = "";
                if (err.response.status === 500) {
                    errorMessage = "בעיה במערכת";
                }
                else
                    errorMessage = err.response.data;
                dispatch({ type: CHECK_PROGRESS_ERROR, error: errorMessage, employerID: employerId });
            });
    }
};