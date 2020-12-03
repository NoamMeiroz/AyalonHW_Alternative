
import { FILE_UPLOAD } from '../actions/types';

const INITIAL_STATE = {
    isLoaded: false,
    errorMessage: '',
    timestamp: new Date()
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FILE_UPLOAD:
            let company = action.data;
            let sum = company.Sites.reduce((sum, site) => {
                return (sum + site.NUM_OF_EMPLOYEES);
            }, 0);
            company.EMP_COUNT = sum;
            company.SITE_COUNT = company.Sites.length
            return {...state, timestamp: new Date(), isSuccess: true, data: company};
        default:
            return state;
    }
    
}