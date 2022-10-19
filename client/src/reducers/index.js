import  { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import messages from './messages';
import longExecution from './longExecution';
import loadData from './loadData';
import employeesData from './employeesData';
import reports from './reports';
import reportTypeSelection from './reportTypeSelection';
import reportParams from './reportParams';
import consts from './const';
import map from './map';
import algorithmSettings from './algorithmSettings'


export default combineReducers({
    auth,
    messages,
    longExecution,
    loadData,
    employeesData,
    reports,
    reportTypeSelection,
    consts,
    reportParams,
    map,
    algorithmSettings,
    form: formReducer
});