
import { START_FILE_UPLOAD, START_RECALCULATE_COMPANY } from '../actions/types';

const INITIAL_STATE = {
    company: {},
    timestamp: new Date()
}

export default function(state = INITIAL_STATE, action) {
    let employerID = null;
    switch (action.type) {
        case START_FILE_UPLOAD:
            employerID = action.company.id;
            return {...state, timestamp: new Date(), employerID: employerID};
        case START_RECALCULATE_COMPANY:
            employerID = action.employerID;
            return {...state, timestamp: new Date(), employerID: employerID};
        default:
            return state;
    }
    
}