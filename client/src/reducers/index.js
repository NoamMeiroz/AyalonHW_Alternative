import  { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import files from './files';
import loadData from './loadData';
import employeesData from './employeesData';

export default combineReducers({
    auth,
    files,
    loadData,
    employeesData,
    form: formReducer
});