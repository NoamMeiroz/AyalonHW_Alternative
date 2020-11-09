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
            let companyList = action.companyList;
            for (let company of companyList) {
                let sum = company.Sites.reduce((sum, site) => {
                    return (sum + site.NUM_OF_EMPLOYEES);
                }, 0);
                company.EMP_COUNT = sum;
                company.SITE_COUNT = company.Sites.length
            }
            return {...state, 
                isSuccess: action.isSuccess, 
                sectorList: action.sectorList,
                companyList: companyList,
                errorMessage: action.errorMessage,
                timestamp: new Date()
            };
        default:
            return state;
    }
}
