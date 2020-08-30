import axios from 'axios';
import { AUTH_USER, AUTH_ERROR, FILE_UPLOAD, 
    FILE_ERROR, LOAD_DATA, EMPLOYEES_DATA } from './types';
import {SERVER} from '../utils/config';

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
            }}).then(data=>{
                dispatch({ type: AUTH_USER, payload: data.data.token });
                localStorage.setItem( 'token', data.data.token ); // save token use for later
                callback();
            }).catch(err=>{ 
                dispatch({type: AUTH_ERROR, payload: handleError(err.response.status)})});
    }
};

export const signOut = () => {
    localStorage.removeItem('token');
    return { type: AUTH_USER, payload: ''};
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
        axios.post(`${SERVER}/api/upload/`,
            form, 
            {
                headers: {
               'Content-Type': `multipart/form-data; boundary=${form._boundary}`
            }}).then(data=>{
                dispatch({ type: FILE_UPLOAD, isSuccess: true, data: data.data });
                callback(true, data.data);
            }).catch(err=>{
                let message = "";
                if(!err.response) {
                    message = "יש בעיה באתר";
                }
                else if (err.response.status===500) {
                    message = "טעינת קובץ נכשלה עקב בעיה במערכת";
                }
                else
                    message = err.response.data;
                dispatch({type: FILE_ERROR, isSuccess: false, errorMessage: message})
                callback(false, message);
                
            });
    }
};

/**
 * return the company list stores in server
 */
export const getData = () => {
    return (dispatch) => {
        axios.get(`${SERVER}/api/getData/`)
            .then(payload=>{
                dispatch({ type: LOAD_DATA, isSuccess: true, sectorList: payload.data.sectors, companyList: payload.data.companies });
                return payload;
            }).catch(err=>{
                let message = "";
                if (err.response.status===500) {
                    message = "בעיה במערכת";
                }
                else
                    message = err.response.data;
                dispatch({type: LOAD_DATA, isSuccess: false, errorMessage: message}); 
                return message;           
            });
    }
};

/**
 * return the company list stores in server
 */
export const getEmployeesOfEmployer = (employerId) => {
    return (dispatch) => {
        axios.get(`${SERVER}/api/employer/${employerId}/employee`)
            .then(payload=>{
                dispatch({ type: EMPLOYEES_DATA, isSuccess: true, employeesList: payload.data });
            }).catch(err=>{
                let message = "";
                if (err.response.status===500) {
                    message = "בעיה במערכת";
                }
                else
                    message = err.response.data;
                dispatch({type: EMPLOYEES_DATA, isSuccess: false, errorMessage: message});          
            });
    }
};