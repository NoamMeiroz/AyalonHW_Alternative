import axios from 'axios';
import {getUID} from './index';
import {
    START_FILE_UPLOAD,
    LOAD_DATA,
    ADD_NEW_COMPANY,
    CHECK_PROGRESS, ERROR,
    UPLOAD_RESULT,
    MESSAGE,
    DELETE_COMPANY,
    RECALCULATE_COMPANY,
    START_RECALCULATE_COMPANY
} from './types';
import {UPLOAD_FAILED, getCompundList} from './const';
import * as actionUtils from '../utils/actionsUtil';

/**
 * Upload xlsx file into the server
 * @param {*} file 
 */
export const upload = (file) => {
    const form = new FormData();
    form.append("uid", localStorage.getItem('websocket_uid'));
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
                dispatch({ type: START_FILE_UPLOAD, isSuccess: true, company: data.data });
                dispatch({ type: ADD_NEW_COMPANY, new_company: data.data });
                dispatch({ type: MESSAGE, message: 'תהליך טעינת נתוני החברה החל'});
                //dispatch(checkProgress(data.data.id));
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
        dispatch(getCompundList());
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
};*/

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

/**
 * return the company list stores in server
 */
export const deleteCompany = (employerId) => {
    return (dispatch) => {
        axios.delete(`/api/employer/${employerId}`, actionUtils.getAxiosHeader())
            .then(() => {
                dispatch({ type: DELETE_COMPANY, isSuccess: true, employerID: employerId });
                dispatch({ type: MESSAGE, message: `מחיקת החברה הסתיימה בהצלחה` });
                dispatch(getCompundList());
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
};


/**
 * run recalculation of routes from google and final marks
 */
export const recalculate = (employerId) => {
    return (dispatch) => {
        axios.put(`/api/employer/${employerId}/recalculate`,
            {"uid": localStorage.getItem('websocket_uid')}, 
            actionUtils.getAxiosHeader())
            .then(() => {
                dispatch({ type: START_RECALCULATE_COMPANY, isSuccess: true, employerID: employerId });
                dispatch({ type: RECALCULATE_COMPANY, employerID: employerId});
                dispatch({ type: MESSAGE, message: `חישוב מסלולים וציונים החל` });
            }).catch(err => {
                let message = actionUtils.handleError(err);
                dispatch({ type: ERROR, errorMessage: message });
            });
    }
};

/**
 * Show upload result as a message and update the company row
 * @param {*} file 
 * @param {*} callback 
 */
export const recalculateResult = (result) => {
    return (dispatch) => {
        dispatch({ type: UPLOAD_RESULT, result: result });
        dispatch({ type: MESSAGE, message: `תהליך חישוב מסלולים וציונים מחדש הסתיים בהצלחה.` })
    }
};
