const db = require("./database");
const {getMessage} = require("./errorCode");
const { isFinishedWithEmployees } = require("./employerSchema");
const Employee = db.employee;
const EmployerSites = db.employerSites;


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

  /**
   * Return list of employees of specific employer
   * @param {int} employerId 
   * @param {*} callback 
   */
  const getEmployeesOfEmployer = (employerId, callback) => {
      Employee.findAll({
        where: {
          employer_id: employerId
        },
        include:[{ model: EmployerSites, as: "Site"}]
      }).then(data=>{callback(null, data)})
        .catch(err=>{callback(err, getMessage(err));});
  }

  /**
   * Return % of finished calculation on employees 
   * @param {int} employerID 
   * @param {*} callback 
   */
  const getPrecentFinished = (employerID, callback) => {
    let countFinished = 0;
    let total = 0;
    isFinishedWithEmployees(employerID, (err, data) => {
      if (err)
        callback(err, getMessage(err));
      else if (data)
        callback(null, 100);
    });
       
    Employee.count({
        where: {
          EMPLOYER_ID: employerID,
          BEST_ROUTE: {
            [db.Sequelize.Op.ne]: null
          }
        }
      }).then(data=>{
        countFinished = data;
        Employee.count({
          where: {
            EMPLOYER_ID: employerID 
          }
        }
      ).then(countAll=>{
        let precent = 0;
        total = countAll;
        if (countFinished==0)
          precent = 0;
        else {
          precent = parseInt(countFinished / total )*100;
        }
        callback(null, precent);
      })})
      .catch(err=>{callback(err, getMessage(err));});
  }
  module.exports = { insertBulk, updateRoute, getEmployeesOfEmployer, getPrecentFinished };
