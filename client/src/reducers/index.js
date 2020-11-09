import  { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import messages from './messages';
import uploadFile from './uploadFile';
import loadData from './loadData';
import employeesData from './employeesData';
import reports from './reports';


export default combineReducers({
    auth,
    messages,
    uploadFile,
    loadData,
    employeesData,
    reports,
    form: formReducer
});