import { ADD_NEW_COMPANY, LOAD_DATA, UPLOAD_RESULT, CHECK_PROGRESS, DELETE_COMPANY, RECALCULATE_COMPANY } from '../actions/types';
import { UPLOAD_FAILED, UPLOAD_IN_PROGRESS, UPLOAD_SUCESS } from '../actions/const';

const INITIAL_STATE = {
    sectorList: {},
    companyList: [],
    timestamp: new Date()
}

const LOADING_FAILED_MESSAGE = "טעינת עובדים נכשלה"

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
                if (company.EMPLOYEES_READY === UPLOAD_FAILED)
                    company.EMP_COUNT_DESC = LOADING_FAILED_MESSAGE
                else
                    company.EMP_COUNT_DESC = `${company.countValidEmployees} מתוך ${sum}`;
                company.SITE_COUNT = company.Sites.length
            }
            return {
                ...state,
                sectorList: action.sectorList,
                companyList: companyList,
                timestamp: new Date()
            };
        case ADD_NEW_COMPANY:
            let newCompany = action.new_company;
            newCompany.EMP_COUNT = 0;
            newCompany.EMP_COUNT_DESC = "?";
            newCompany.SITE_COUNT = newCompany.Sites.length
            newCompany.UPLOAD_PROGRESS = UPLOAD_IN_PROGRESS;
            newCompany.EMPLOYEES_READY = 0;
            // remove old company if exists
            tempList = state.companyList
            tempList = tempList.filter(company => {
                return (company.NAME !== newCompany.NAME);
            });
            tempList = [...tempList, newCompany];

            return {
                ...state,
                companyList: tempList,
                timestamp: new Date()
            };
        case RECALCULATE_COMPANY:
            tempList = state.companyList;
            tempList = tempList.map((company) => {
                if (company.id === action.employerID) {
                    company.UPLOAD_PROGRESS = UPLOAD_IN_PROGRESS;
                    company.EMPLOYEES_READY = 0;
                }
                return company;
            });
            return {
                ...state,
                companyList: tempList,
                timestamp: new Date()
            }
        case CHECK_PROGRESS:
            tempList = state.companyList;
            tempList = tempList.map((company) => {
                if (company.id === action.employerID) {
                    company.UPLOAD_PROGRESS = action.uploadProgess;
                    if (action.uploadProgess === 100)
                        company.EMPLOYEES_READY = UPLOAD_SUCESS;
                    else if (action.uploadProgess === UPLOAD_FAILED) {
                        company.EMPLOYEES_READY = UPLOAD_FAILED;
                        company.EMP_COUNT_DESC = LOADING_FAILED_MESSAGE
                    }
                }
                return company;
            });
            return {
                ...state,
                companyList: tempList,
                timestamp: new Date()
            }
        case UPLOAD_RESULT:
            tempList = state.companyList;
            tempList = tempList.map((company) => {
                if (company.id === action.result.employerID) {
                    company.EMP_COUNT = action.result.successCount;
                    company.EMP_COUNT_DESC = `${action.result.successCount} מתוך ${action.result.total}`;
                }
                return company;
            });
            return {
                ...state,
                companyList: tempList,
                timestamp: new Date()
            };
        case DELETE_COMPANY:
            tempList = state.companyList;
            tempList = tempList.filter((company) => company.id !== action.employerID);
            return {
                ...state,
                companyList: tempList,
                timestamp: new Date()
            };
        default:
            return state;
    }
}
