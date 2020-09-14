const { workerData, parentPort } = require('worker_threads')
const employeeSchema = require('../db/employeeSchema');
const empFields = require("../config/config").employeeFieldsName;
const siteFields = require("../config/config").sitesFieldsName;
const googleAPI = require("./googleAPI");
const { ServerError, logger } = require('../log');
const user = require('../models/user');


const employer = workerData.employer;
var employeeList = workerData.employees;

function save(employeeList) {
    // save all employees in the db
    employeeSchema.insertBulk(employeeList, (err, data) => {
        if (err) {
            // return result to main thread
            logger.error(err);
            return parentPort.postMessage({ Employees: null, message: err.stack });
        }
        let empList = data.map((employee) => {
            return employee.dataValues;
        });
        // return result to main thread
        parentPort.postMessage({ Employees: empList });
    });
}

// create list of employee object
employeeList = employeeList.map((emp) => {
    let employee = {
        EMPLOYER_ID: employer.id,
        WORKER_ID: emp[empFields.WORKER_ID],
        CITY: emp[empFields.CITY],
        STREET: emp[empFields.STREET],
        BUILDING_NUMBER: emp[empFields.BUILDING_NUMBER],
        BEST_ROUTE: {}
    }
    site = employer.Sites.filter((site) => {
        return (site.NAME === emp[siteFields.NAME])
    })
    employee.WORK_SITE = site[0].id;
    return employee;
});
// calculate coordination
let convertPromise = [];
employeeList.forEach((employee, index, array) => {
    convertPromise.push(googleAPI.convertLocation(employee.CITY, employee.STREET, employee.BUILDING_NUMBER));
});

// wait to finish with all employees and then save
Promise.all(convertPromise)
    .then(result => {
        result.forEach((value, index, array) => {
            if (value instanceof ServerError) {
                switch (value.status) {
                    case googleAPI.ERRORS.INVALID_ADDRESS_CODE:
                        employeeList[index].BEST_ROUTE = { value: "כתובת העובד לא חוקית." };
                        break;
                    case googleAPI.ERRORS.MISSING_CITY_CODE:
                        employeeList[index].BEST_ROUTE = { value: "חסר עיר מגורים" };
                        employeeList[index].CITY = "____";
                        break;
                    case googleAPI.ERRORS.MISSING_STREET_CODE:
                        employeeList[index].BEST_ROUTE = { value: "חסר שם רחוב" };
                        employeeList[index].STREET = "____";
                        break;
                    case googleAPI.ERRORS.MISSING_BUILDING_NUMBER_CODE:
                        employeeList[index].BEST_ROUTE = { value: "חסר מספר בניין" };
                        employeeList[index].BUILDING_NUMBER = 0;
                        break;
                    default:
                        employeeList[index].BEST_ROUTE = { value: "שגיאה לא ידועה" };
                        break;
                }
            }
            else {
                employeeList[index].X = value.X;
                employeeList[index].Y = value.Y;
            }
        })
        save(employeeList);
    })
    .catch(error => {
        logger.error(error.stack);
        // return result to main thread
        parentPort.postMessage({ Employees: null, message: error.stack });
    });