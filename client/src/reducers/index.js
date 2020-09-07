import  { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import uploadFile from './uploadFile';
import loadData from './loadData';
import employeesData from './employeesData';

export default combineReducers({
    auth,
    uploadFile,
    loadData,
    employeesData,
    form: formReducer
});