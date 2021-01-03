const db = require("./database");
const { getMessage } = require("./errorCode");
const { loadingStatus } = require("./employerSchema");
const Employee = db.employee;
const Employer = db.employer;
const EmployerSites = db.employerSites;
const  Op = db.Sequelize.Op;

/**
 * Insert employee object
 * @param {*} employee 
 * @param {*} callback 
 */
const insert = (employee, callback) => {
   // Save in the database
   Employee.create(employee)
      .then(data => { callback(null, data) })
      .catch(err => {
         callback(err, getMessage(err));
      });
}

/**
 * Insert a bulk of emplyees with one sql statement
 * @param {*} employees 
 * @param {*} callback 
 */
const insertBulk = (employees, callback) => {
   // Save  in the database
   Employee.bulkCreate(employees)
      .then(data => { callback(null, data) })
      .catch(err => {
         callback(err, getMessage(err));
      });
};


/**
 * Delete all employees of employer
 * @param {*} employerID
 * @param {*} callback 
 */
const deleteEmployees = (employerID, callback) => {
   Employee.destroy({
      returning: true,
      where: { employer_id: employerID }
   })
      .then(data => { callback(null, data) })
      .catch(err => {
         callback(err, getMessage(err));
      });
}

/**
 * Update a given employee with best route. 
 * @param {*} employee 
 * @param {*} route - json object representing best route
 * @param {*} callback 
 */
const updateRoute = (employee, route, callback) => {
   Employee.update({ BEST_ROUTE: route }, { where: { id: employee.id } })
      .then(rowsUpdate => {
         callback(null, rowsUpdate);
      })
      .catch(err => {
         callback(err, getMessage(err));
      });
}

/**
 * Return list of employees of specific employer
 * @param {int} employerId
 * @param {[]} livingCity  - list of cities names where employees live
 * @param {[]} workingCity  - list of cities names where employees works
 * @param {*} callback 
 */
const getEmployeesOfEmployer = (employerId, livingCity=[], workingCity=[], callback) => {
   let whereClause = {where: {
      employer_id: employerId
   }};
   if (livingCity && livingCity.length>0)
      whereClause.where.CITY = { [Op.in]: livingCity };
   let include = [{ model: EmployerSites, as: "Site" }, { model: Employer, as: "employer" }];
   if (workingCity && workingCity.length>0)
      include[0].where = { ADDRESS_CITY: {[Op.in]: workingCity}};
   whereClause = {...whereClause,include};
   Employee.findAll(
      whereClause
   ).then(data => { callback(null, data) })
      .catch(err => { callback(err, getMessage(err)); });
}

/**
 * Return any employee working in one of the a given employers
 * @param {[]]} employerId- list of employer ids.
 * @param {[]} livingCity  - list of cities names where employees live
 * @param {[]} workingCity  - list of cities names where employees works
 * @param {*} callback 
 */
const getEmployees = (employerList, livingCity=[], workingCity=[], callback) => {
   let whereClause = {where: {} };
   if (employerList && employerList.length>0)
      whereClause.where.employer_id = { [Op.in]: employerList };
   if (livingCity && livingCity.length>0)
      whereClause.where.CITY = { [Op.in]: livingCity };
   let include = [{ model: EmployerSites, as: "Site" }, { model: Employer, as: "employer" }];
   if (workingCity && workingCity.length>0)
      include[0].where = { ADDRESS_CITY: {[Op.in]: workingCity}};

   whereClause = {...whereClause,include};
   Employee.findAll(
      whereClause
   ).then(data => { callback(null, data) })
      .catch(err => { callback(err, getMessage(err)); });
}

/**
 * Return % of finished calculation on employees 
 * @param {int} employerID 
 * @param {*} callback 
 */
const getPrecentFinished = (employerID, callback) => {
   // check if finished with employees by checking the status in the employers table
   loadingStatus(employerID, (err, data) => {
      if (err)
         callback(err, getMessage(err));
      // if result is true return 100 precent;
      else if (data) {
         callback(null, 100);
      }
      // 
      else {
         Promise.all([Employee.count({
            where: {
               EMPLOYER_ID: employerID,
               BEST_ROUTE: {
                  [db.Sequelize.Op.ne]: null
               }
            }
         }), EmployerSites.sum('NUM_OF_EMPLOYEES', {
            where: {
               EMPLOYER_ID: employerID
            }
         })])
         .then(results => {
            let countFinished = results[0];
            let precent = 0;
            let total = results[1];
            if (countFinished === 0)
               precent = 0;
            else {
               precent = Math.ceil((countFinished / total) * 100);
            }
            callback(null, precent);
         })
         .catch(err => {
            callback(err, getMessage(err));
         });
      }
   });
}


module.exports = { insertBulk, updateRoute, getEmployeesOfEmployer, getPrecentFinished, 
   getEmployees };
