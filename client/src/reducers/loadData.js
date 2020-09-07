import { LOAD_DATA } from '../actions/types';

const INITIAL_STATE = {
    isSuccess: false,
    errorMessage: '',
    sectorList: {}, 
    companyList: [],
    timestamp: new Date()
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOAD_DATA:
            return {...state, 
                isSuccess: action.isSuccess, 
                sectorList: action.sectorList,
                companyList: action.companyList,
                errorMessage: action.errorMessage,
                timestamp: new Date()
            };
        default:
            return state;
    }
}
