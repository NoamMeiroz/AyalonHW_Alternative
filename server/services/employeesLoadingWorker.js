const { workerData, parentPort } = require('worker_threads')
const employeeSchema = require('../db/employeeSchema');
const empFields = require("../config/config").employeeFieldsName;

const { getFirstNumberInString, sleep, isInteger } = require('../tools');
const googleAPI = require("./googleAPI");
const { ServerError, logger } = require('../log');
const { ConsoleTransportOptions } = require('winston/lib/winston/transports');

//const employee = require('../models/employee');

const GRADE_COLUMNS = ["SHORT_HOURS_GRADE", "SHIFTING_HOURS_GRADE",
   "BICYCLE_GRADE", "SCOOTER_GRADE", "PERSONALIZED_SHUTTLE_GRADE",
   "WORK_SHUTTLE_GRADE", "CARSHARE_GRADE", "CARPOOL_GRADE",
   "CABSHARE_GRADE", "PUBLIC_TRANSPORT_GRADE", "WALKING_GRADE",
   "WORKING_FROM_HOME_GRADE", "SHARED_WORKSPACE_GRADE", "SHIFTING_WORKING_DAYS_GRADE"];

/**----------------------------------------------------------
 * Healper functions
 -----------------------------------------------------------*/

const save = async function (employee) {
   return new Promise(function (resolve, reject) {
      // save all employees in the db
      employeeSchema.insertBulk(employee, (err, data) => {
         if (err) {
            return reject(err);
         }
         return resolve(data);
      });
   });
}

const findRoutes = async function (employee, sites) {
   return new Promise(async function (resolve, reject) {
      promiseList = [];
      // check if the employee best_route is empty. 
      // if not then there is a problem with this employee address
      if (employee.BEST_ROUTE) {
         resolve(employee);
      }
      origin = {
         city: employee.CITY, street: employee.STREET,
         buildingNumber: employee.BUILDING_NUMBER
      };

      // find the address of the office where the employees work
      workSite = sites.find((site) => {
         return (site.id === employee.WORK_SITE)
      })
      destination = {
         city: workSite.ADDRESS_CITY, street: workSite.ADDRESS_STREET,
         buildingNumber: workSite.ADDRESS_BUILDING_NUMBER
      };
      googleAPI.getRoutes(origin, destination)
         .then(routeResult => {
            employee.BEST_ROUTE = routeResult;
            return resolve(employee);
         })
         .catch(error => {
            logger.error(error);
            return reject(error);
         });
   });
}

/**
 * Find coordinates of a given employee
 * @param {Object} employee 
 */
const findCoordinates = async (employee) => {
   return new Promise(async (resolve, reject) => {
      googleAPI.convertLocation(employee.CITY, employee.STREET,
         employee.BUILDING_NUMBER)
         .then(value => {
            // check type of error and set an error message in BEST_ROUTE
            if (value instanceof ServerError) {
               logger.info(value);
               switch (value.status) {
                  case googleAPI.ERRORS.INVALID_ADDRESS_CODE:
                     employee.BEST_ROUTE = { error: "כתובת העובד אינה תקינה." };
                     break;
                  case googleAPI.ERRORS.MISSING_CITY_CODE:
                     employee.BEST_ROUTE = { error: "חסר עיר מגורים" };
                     employee.CITY = "____";
                     break;
                  case googleAPI.ERRORS.MISSING_STREET_CODE:
                     employee.BEST_ROUTE = { error: "חסר שם רחוב" };
                     employee.STREET = "____";
                     break;
                  case googleAPI.ERRORS.MISSING_BUILDING_NUMBER_CODE:
                     employee.BEST_ROUTE = { error: "חסר מספר בניין" };
                     employee.BUILDING_NUMBER = 0;
                     break;
                  case googleAPI.ERRORS.INVALID_CITY:
                     employee.BEST_ROUTE = { error: "בעיית איות בשם העיר" };
                     break;
                  case googleAPI.ERRORS.INVALID_STREET:
                     employee.BEST_ROUTE = { error: "בעיית איות בשם הרחוב" };
                     break;
                  case googleAPI.ERRORS.MISSING_CITY_CODE:
                     logger.error(value);
                     employee.X = value.X;
                     employee.Y = value.Y;
                     break;
                  case googleAPI.ERRORS.HELKA_NOT_FOUND:
                     logger.error(value);
                     employee.X = value.X;
                     employee.Y = value.Y;
                     break;
                  default:
                     employee.BEST_ROUTE = { error: "שגיאה לא ידועה" };
                     break;
               }
            }
            // there is no error so store X, Y coordinates
            else {

               employee.X = value.X;
               employee.Y = value.Y;
               employee.CITY = value.CITY;
            }
            return resolve(employee);
         })
         .catch(error => {
            logger.error(error);
            return reject(error);
         });

   });
}

/**
 * convert employee address to coordinates using google api
 * If an address is invalid then store the error in the BEST_ROUTE field of the same record
 * If no exception then save to db.
 * return results. 
 */
const insertEmployee = async function (employeeList) {
   return new Promise(async function (resolve, reject) {

      let promiseList = []
      // calculate coordination
      employeeList.forEach(employee => {
         // find coordinates only if there is no error in the record
         if (employee.BEST_ROUTE === null)
            promiseList.push(findCoordinates(employee));
         else
            promiseList.push(employee);
      });
      Promise.all(promiseList)
         .then(employees => {
            let promiseList = [];
            employees.forEach(employee => {
               // find routes only to employees with valid address
               if (employee.BEST_ROUTE === null)
                  promiseList.push(findRoutes(employee, employer.Sites));
               else
                  promiseList.push(employee);
            });
            Promise.all(promiseList)
               .then(employees => {
                  data = save(employees);
                  return resolve(data);
               })
               .catch(error => {
                  return reject(error);
               });
         })
         .catch(error => {
            return reject(error);
         });

   });
}

const getSiteID = (workSite, siteList) => {
   let currentSite = siteList.filter(site => site.SITE_ID === workSite);
   return currentSite[0].id;
}

/**
 * Invoke the callback function at a given time from now (miliseconds)
 * @param {integer} waitTime in miliseconds
 * @param {function} callback 
 * @param {list of employees as input to the callback} employeeList 
 */
const runAndWait = async (waitTime, callback, employeeList) => {
   return new Promise((resolve, reject) => {
      setTimeout(function () {
         callback(employeeList).then(employees => resolve(employees))
            .catch(error => { reject(error) });
      }, waitTime);
   });
}

/**----------------------------------------------------------
 * Main thread
 * -------------------------------------------------------- */

const employer = workerData.employer;
var employeeList = workerData.employees;
const sites = employer.Sites;
// create list of employee object
let empList = employeeList.map((emp) => {
   let employee = {
      EMPLOYER_ID: employer.id,
      WORKER_ID: emp[empFields.WORKER_ID],
      CITY: emp[empFields.CITY],
      STREET: emp[empFields.STREET],
      BUILDING_NUMBER: (getFirstNumberInString(emp[empFields.BUILDING_NUMBER]) || 0),
      WORK_SITE: getSiteID(emp[empFields.BRANCH_ID], sites),
      BEST_ROUTE: null,
      SHORT_HOURS_GRADE: emp[empFields.SHORT_HOURS_GRADE],
      SHIFTING_HOURS_GRADE: emp[empFields.SHIFTING_HOURS_GRADE],
      BICYCLE_GRADE: emp[empFields.BICYCLE_GRADE],
      SCOOTER_GRADE: emp[empFields.SCOOTER_GRADE],
      PERSONALIZED_SHUTTLE_GRADE: emp[empFields.PERSONALIZED_SHUTTLE_GRADE],
      WORK_SHUTTLE_GRADE: emp[empFields.WORK_SHUTTLE_GRADE],
      CARSHARE_GRADE: emp[empFields.CARSHARE_GRADE],
      CARPOOL_GRADE: emp[empFields.CARPOOL_GRADE],
      CABSHARE_GRADE: emp[empFields.CABSHARE_GRADE],
      PUBLIC_TRANSPORT_GRADE: emp[empFields.PUBLIC_TRANSPORT_GRADE],
      WALKING_GRADE: emp[empFields.WALKING_GRADE],
      WORKING_FROM_HOME_GRADE: emp[empFields.WORKING_FROM_HOME_GRADE],
      SHARED_WORKSPACE_GRADE: emp[empFields.SHARED_WORKSPACE_GRADE],
      SHIFTING_WORKING_DAYS_GRADE: emp[empFields.SHIFTING_WORKING_DAYS_GRADE]
   }
   let error = "";
   for (column of GRADE_COLUMNS) {
      if (!isInteger(employee[column])) {
         employee[column] = null;
         error = error + `הערך ב-${empFields[column]} אינו חוקי.`;
      }
   }
   if (error !== "")
      employee.BEST_ROUTE = { error: error };
   return employee;
});
logger.info(`employer ${employer.NAME}: calculation employees coordinates`)

let awaitTime = 5000;
let chunk = 5;
let promiseList = [];
// work on chunck of employees to avoid huge bulk insert and to much requests of the google api at once
for (i = 0, j = empList.length; i < j; i += chunk) {
   employeesChunk = empList.slice(i, i + chunk);
   promise = runAndWait(awaitTime * (i / chunk), insertEmployee, employeesChunk)
   promiseList.push(promise);
}


// collect all employees to one list and return result to main thread.
Promise.all(promiseList)
   .then(results => {
      let empList = [];
      results.forEach((emplyees, index, array) => {
         empList = empList.concat(emplyees);
      });
      parentPort.postMessage({ Employees: empList });

   })
   .catch(error => {
      logger.error(error);
      // return result to main thread
      parentPort.postMessage({ Employees: null, message: error.stack });
   });
