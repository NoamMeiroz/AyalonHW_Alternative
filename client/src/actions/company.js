import axios from 'axios';
import {
    FILE_UPLOAD,
    LOAD_DATA, EMPLOYEES_DATA,
    ADD_NEW_COMPANY,
    CHECK_PROGRESS, ERROR,
    UPLOAD_RESULT,
    MESSAGE,
} from './types';
import {UPLOAD_FAILED} from './const';
import * as actionUtils from '../utils/actionsUtil';

/**
 * Upload xlsx file into the server
 * @param {*} file 
 */
export const upload = (file) => {
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
                dispatch({ type: ADD_NEW_COMPANY, new_company: data.data })
                dispatch(checkProgress(data.data.id));
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message })
            });
    }
};


/**
 * Show upload result as a message and update the company row
 * @param {*} file 
 * @param {*} callback 
 */
export const uploadResult = (result) => {
    return (dispatch) => {
        dispatch({ type: UPLOAD_RESULT, result: result });
        dispatch({ type: MESSAGE, message: `תהליך הטעינה הסתיים: נטענו בהצלחה ${result.successCount} מתוך ${result.total}` })
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

/**
 * Check the progress status of uploading a file.
 * @param {id of employer} employerId 
 */
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
                    let message = "בעיה במערכת, נא לפנות לתמיכה";
                    dispatch({ type: ERROR, errorMessage: message, employerID: employerId });
                    dispatch({
                        type: CHECK_PROGRESS,
                        employerID: employerId,
                        uploadProgess: UPLOAD_FAILED
                    });
                }
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message, employerID: employerId });
                dispatch({
                    type: CHECK_PROGRESS,
                    employerID: employerId,
                    uploadProgess: UPLOAD_FAILED
                });
            });
    }
};