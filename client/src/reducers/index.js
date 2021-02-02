import  { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import messages from './messages';
import uploadFile from './uploadFile';
import loadData from './loadData';
import employeesData from './employeesData';
import reports from './reports';
import reportTypeSelection from './reportTypeSelection';
import reportParams from './reportParams';
import notifications from './notifications';
import consts from './const';

export default combineReducers({
    auth,
    messages,
    uploadFile,
    loadData,
    employeesData,
    reports,
    reportTypeSelection,
    consts,
    reportParams,
    notifications,
    form: formReducer
});