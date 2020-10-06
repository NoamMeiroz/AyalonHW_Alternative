const { workerData, parentPort } = require('worker_threads')
const employeeSchema = require('../db/employeeSchema');
const empFields = require("../config/config").employeeFieldsName;
const siteFields = require("../config/config").sitesFieldsName;
const { getFirstNumberInString, sleep } = require('../tools');
const googleAPI = require("./googleAPI");
const { ServerError, logger } = require('../log');

const employer = workerData.employer;
var employeeList = workerData.employees;

function save(employeeList) {
   return new Promise(function (resolve, reject) {
      // save all employees in the db
      employeeSchema.insertBulk(employeeList, (err, data) => {
         if (err) {
            return reject(err);
         }
         let empList = data.map((employee) => {
            return employee.dataValues;
         });
         resolve(empList);
      });
   });

}

/**
 * convert employee address to coordinates using google api
 * If an address is invalid then store the error in the BEST_ROUTE field of the same record
 * If no exception then save to db.
 * return results. 
 */
calculateEmployee = async (employeeList) => {
   return new Promise(function (resolve, reject) {
      // calculate coordination
      let convertPromise = [];
      employeeList.forEach((employee, index, array) => {
         p = await googleAPI.convertLocation(employee.CITY, employee.STREET, employee.BUILDING_NUMBER)
         convertPromise.push(p);
      });

      // wait to finish with all employees and then save
      Promise.all(convertPromise)
         .then(result => {
            result.forEach((value, index, array) => {
               if (value instanceof ServerError) {
                  switch (value.status) {
                     case googleAPI.ERRORS.INVALID_ADDRESS_CODE:
                        employeeList[index].BEST_ROUTE = { error: "כתובת העובד לא חוקית." };
                        break;
                     case googleAPI.ERRORS.MISSING_CITY_CODE:
                        employeeList[index].BEST_ROUTE = { error: "חסר עיר מגורים" };
                        employeeList[index].CITY = "____";
                        break;
                     case googleAPI.ERRORS.MISSING_STREET_CODE:
                        employeeList[index].BEST_ROUTE = { error: "חסר שם רחוב" };
                        employeeList[index].STREET = "____";
                        break;
                     case googleAPI.ERRORS.MISSING_BUILDING_NUMBER_CODE:
                        employeeList[index].BEST_ROUTE = { error: "חסר מספר בניין" };
                        employeeList[index].BUILDING_NUMBER = 0;
                        break;
                     default:
                        employeeList[index].BEST_ROUTE = { error: "שגיאה לא ידועה" };
                        break;
                  }
               }
               else {
                  employeeList[index].X = value.X;
                  employeeList[index].Y = value.Y;
               }
            })
            save(employeeList)
               .then(data => resolve(data))
               .catch(error => {
                  reject(error);
               });
         })
         .catch(error => {
            reject(error);
         });
   });
}

// create list of employee object
let empList = employeeList.map((emp) => {
   let employee = {
      EMPLOYER_ID: employer.id,
      WORKER_ID: emp[empFields.WORKER_ID],
      CITY: emp[empFields.CITY],
      STREET: emp[empFields.STREET],
      BUILDING_NUMBER: (getFirstNumberInString(emp[empFields.BUILDING_NUMBER])||0),
      BEST_ROUTE: null
   }
   site = employer.Sites.filter((site) => {
      return (site.NAME === emp[siteFields.NAME])
   })
   employee.WORK_SITE = site[0].id;
   return employee;
});

const findRoutes = (employeeList, sites) => {
   return new Promise(function (resolve, reject) {
      promiseList = [];
      employeeList.forEach((employee, index, array) => {
         // check if the employee best_route is empty. 
         // if not then there is a problem with this employee address
         if (employee.BEST_ROUTE) {
            promiseList.push(employee.BEST_ROUTE);
            return;
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
         promiseList.push(googleAPI.getRoutes(origin, destination));
      });
      Promise.all(promiseList)
         .then(results => {
            results.forEach((routeResult, index, array) => {
               if (routeResult instanceof ServerError) {
                  logger.error(error);
               }
               else {
                  employeeSchema.updateRoute(employeeList[index], routeResult, (error, data) => {
                     if (error)
                        logger.error(error.stack);
                  });
               }
               
            });
            resolve;
         })
         .catch(error => {
            logger.error(error.stack);
            resolve;
         });
   });
}


logger.info(`employer ${employer.NAME}: calculation employees coordinates`)
let chunk = 5;
let promiseList = [];
// work on chunck of 50 employees to avoid huge bulk insert
for (i = 0, j = empList.length; i < j; i += chunk) {
   employeesChunk = empList.slice(i, i + chunk);
   promiseList.push(calculateEmployee(employeesChunk));
}


// collect all employees to one list and return result to main thread.
Promise.all(promiseList)
   .then(results => {
      let empList = [];
      results.forEach((emplyees, index, array) => {
         empList = empList.concat(emplyees);
         // calculate routes
         logger.info(`employer ${employer.NAME}: calculation employees group #${index + 1} routes`);
         await findRoutes(emplyees, employer.Sites)
            .then(parentPort.postMessage({ Employees: empList }))
            .catch(error => {
               logger.error(error.stack);
               parentPort.postMessage({ Employees: empList });
            });
      });
   })
   .catch(error => {
      logger.error(error.stack);
      // return result to main thread
      parentPort.postMessage({ Employees: null, message: error.stack });
   });
