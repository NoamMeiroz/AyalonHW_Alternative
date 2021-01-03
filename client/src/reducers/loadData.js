import { ADD_NEW_COMPANY, LOAD_DATA, UPLOAD_RESULT } from '../actions/types';

const INITIAL_STATE = {
    isSuccess: false,
    sectorList: {},
    companyList: [],
    timestamp: new Date()
}

export default function (state = INITIAL_STATE, action) {
    let tempList;
    switch (action.type) {
        case LOAD_DATA:
            let companyList = action.companyList;
            for (let company of companyList) {
                let sum = company.Sites.reduce((sum, site) => {
                    return (sum + site.NUM_OF_EMPLOYEES);
                }, 0);
                company.EMP_COUNT = company.countValidEmployees;
                company.EMP_COUNT_DESC = `${company.countValidEmployees} מתוך ${sum}`;
                company.SITE_COUNT = company.Sites.length
            }
            return {
                ...state,
                isSuccess: action.isSuccess,
                sectorList: action.sectorList,
                companyList: companyList,
                timestamp: new Date()
            };
        case ADD_NEW_COMPANY:
            let newCompany = action.new_company;
            /*let sum = newCompany.Sites.reduce((sum, site) => {
                return (sum + site.NUM_OF_EMPLOYEES);
            }, 0);*/
            newCompany.EMP_COUNT = 0;
            newCompany.EMP_COUNT_DESC = "?";
            newCompany.SITE_COUNT = newCompany.Sites.length

            // remove old company if exists
            tempList = state.companyList
            tempList = tempList.filter(company => {
                return (company.NAME !== newCompany.NAME);
            });
            tempList = [...tempList, newCompany];

            return {
                ...state,
                isSuccess: action.isSuccess,
                companyList: tempList,
                timestamp: new Date()
            };
        case UPLOAD_RESULT:
            tempList = state.companyList;
            tempList = tempList.map((company)=> {
                if (company.id === action.result.employerID) {
                    company.EMP_COUNT = action.result.successCount;
                    company.EMP_COUNT_DESC = `${action.result.successCount} מתוך ${action.result.total}`;
                }
                return company;
            });
            console.log(tempList);
            return {
                ...state,
                isSuccess: action.isSuccess,
                companyList: tempList,
                timestamp: new Date()
            };
        default:
            return state;
    }
}
