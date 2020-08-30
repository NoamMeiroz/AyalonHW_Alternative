import { LOAD_DATA } from '../actions/types';

const INITIAL_STATE = {
    isSuccess: false,
    errorMessage: '',
    sectorList: {}, 
    companyList: []

}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOAD_DATA:
            return {...state, 
                isSuccess: action.isSuccess, 
                sectorList: action.sectorList,
                companyList: action.companyList,
                errorMessage: action.errorMessage
            };
        default:
            return state;
    }
}
