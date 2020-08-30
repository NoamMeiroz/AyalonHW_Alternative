const db = require("./database");
const {getMessage} = require("./errorCode");
const employee = require("../models/employee");
const Employee = db.employee;

/**
 * Insert employee object
 * @param {*} employee 
 * @param {*} callback 
 */
const insert = (employee, callback) => {
    // Save in the database
    Employee.create(employee)
      .then(data=>{callback(null, data)})
      .catch(err=>{ 
          callback(err, getMessage(err));});
      }

/**
 * Insert a bulk of emplyees with one sql statement
 * @param {*} employees 
 * @param {*} callback 
 */
const insertBulk = (employees, callback) => {
    // Save  in the database
    Employee.bulkCreate(employees)
        .then(data=>{callback(null, data)})
        .catch(err=>{ 
            callback(err, getMessage(err));});
};


/**
 * Delete all employees of employer
 * @param {*} employerID
 * @param {*} callback 
 */
const deleteEmployees = (employerID, callback) => {
    Employee.destroy({ returning: true,
            where: { employer_id: employerID }})
        .then(data=>{callback(null, data)})
        .catch(err=>{ 
            callback(err, getMessage(err));});
}

      /**
 * insert list of employees. if exists then first delete the old employees data and then insert.
 * @param {*} employerId
 * @param {*} sites
 * @param {*} callback (err, result)
 */
const insertEmployees = (employerId, employees, callback) => {
    // Save in the database
    deleteEmployees(employerId, (err, data) => {
        if (!err)
            insertBulk(employees, callback);
        else
            callback(err, data);
    });
  };

/**
 * Update a given employee with best route. 
 * @param {*} employee 
 * @param {*} route - json object representing best route
 * @param {*} callback 
 */
  const updateRoute = (employee, route, callback) => {
      Employee.update({BEST_ROUTE: route}, {where: {id: employee.id}})
        .then(function([ rowsUpdate, [updatedEmployee] ]) {
            callback(null, updatedEmployee)})
        .catch(err=>{ 
            callback(err, getMessage(err));});
  }

  const getEmployeesOfEmployer = (employerId, callback) => {
      Employee.findAll({
        where: {
          employer_id: employerId
        }
      }).then(data=>{callback(null, data)})
        .catch(err=>{callback(err, getMessage(err));});
  }
  module.exports = { insertBulk, updateRoute, getEmployeesOfEmployer };
