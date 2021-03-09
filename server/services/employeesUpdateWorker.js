const { workerData, parentPort } = require('worker_threads')
const employeeSchema = require('../db/employeeSchema');
const empFields = require("../config/config").employeeFieldsName;
const DEFAULT_EXIT_HOUR = require("../config/config").DEFAULT_EXIT_HOUR_TO_WORK;
const DEFAULT_RETURN_HOUR = require("../config/config").DEFAULT_RETURN_HOUR_TO_HOME;

const { getNearestWorkDay } = require('../tools');
const googleAPI = require("./googleAPI");
const configData = require("./configData");
const timeSlotsData = require("./timeSlotsData");
const { ERRORS } = require("./ERRORS");
const { ServerError, logger } = require('../log');
const { Column, TYPES } = require('./columns/column');
const { City } = require('./columns/city');
const { Street } = require('./columns/street');
const { BuildingNumber } = require('./columns/buildingNumber');
const { TimeSlot } = require('./columns/timeSlot');
const { calculateMark } = require('./route');


/**----------------------------------------------------------
 * Healper functions
 -----------------------------------------------------------*/

const save = async function (employee) {
   return new Promise(function (resolve, reject) {
      // save all employees in the db
      employeeSchema.updateBulk(employee, (err, data) => {
         if (err) {
            return reject(err);
         }
         return resolve(data);
      });
   });
}

/**
 * Return id of timeslot HOUR
 * @param {*} timeSlot 
 */
const getTimeSlotHour = (timeSlot) => {
   let currentSlot = timeSlots.filter(slot => slot.id === timeSlot);
   if (currentSlot.length > 0)
      return currentSlot[0].HOUR;
   else
      throw (new ServerError(ERRORS.TIME_SLOT_NOT_FOUND, timeSlot));
}

const findRoutes = async function (employee, sites) {
   return new Promise(async function (resolve, reject) {
      promiseList = [];
      // check if the employee UPLOAD_ERROR is empty. 
      // if not then there is a problem with this employee address
      if (employee.UPLOAD_ERROR) {
         resolve(employee);
      }
      let origin = {
         city: employee.CITY, street: employee.STREET,
         buildingNumber: employee.BUILDING_NUMBER
      };

      // find the address of the office where the employees work
      workSite = sites.find((site) => {
         return (site.id === employee.WORK_SITE)
      })
      let destination = {
         city: workSite.ADDRESS_CITY, street: workSite.ADDRESS_STREET,
         buildingNumber: workSite.ADDRESS_BUILDING_NUMBER
      };

      // calculate routes from home to work for the nearest work day at
      // the hour the employee is going to work
      // the hour it utc and not local because of google api 
      let time = getNearestWorkDay(new Date(), getTimeSlotHour(employee.EXIT_HOUR_TO_WORK));
      googleAPI.getRoutes(origin, destination, time)
         .then(routeResult => {
            employee.BEST_ROUTE_TO_WORK = routeResult;
            return employee;
         })
         .then(empl => {
            // calculate routes from home to work for the nearest work day at
            // the hour the employee is going to work
            // the hour it utc and not local because of google api 
            let time = getNearestWorkDay(new Date(), getTimeSlotHour(empl.RETURN_HOUR_TO_HOME));
            googleAPI.getRoutes(destination, origin, time)
               .then(routeHomeResult => {
                  empl.BEST_ROUTE_TO_HOME = routeHomeResult;
                  return resolve(empl);
               })
               .catch(error => {
                  logger.error(error.stack);
                  return reject(error);
               });
         })
         .catch(error => {
            logger.error(error.stack);
            return reject(error);
         });
   });
}


/**
 * Calcluare for each employee final marks
 * @param {list of employees} employees 
 * @param {configuration} config 
 */
const calculateMarks = (employees, config) => {
   result = employees.map(employee => calculateMark(employee, config));
   return result;
}


/**
 * 
 * If an address is invalid then store the error in the UPLOAD_ERROR field of the same record
 * If no exception then save to db.
 * return results. 
 */
const updateEmployee = async function (employeeList) {
   return new Promise(async function (resolve, reject) {

      let promiseList = []
      // calculate coordination
      employeeList.forEach(employee => {
         // find routes only to employees with valid address
         if (employee.UPLOAD_ERROR === null)
            promiseList.push(findRoutes(employee, employer.Sites));
         else
            promiseList.push(employee);
      });
      Promise.all(promiseList)
         .then(employees => {
            let employeesList = calculateMarks(employees, config);
            data = save(employeesList);
            return resolve(data);
         })
         .catch(error => {
            return reject(error.stack);
         });
   });
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

logger.info(`employer ${employer.NAME}: calculation employees new routes`)

let awaitTime = 2000;
let chunk = 5;
let promiseList = [];
// work on chunck of employees to avoid huge bulk insert and to much requests of the google api at once
for (i = 0, j = empList.length; i < j; i += chunk) {
   employeesChunk = empList.slice(i, i + chunk);
   promise = runAndWait(awaitTime * (i / chunk), updateEmployee, employeesChunk)
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
      parentPort.postMessage({ Employees: null, message: error });
   });
