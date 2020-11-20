const db = require("./database");

const employee = require("../models/employee");

const Employee = db.employee;
const Employer = db.employer;
const Sector = db.sector;
const EmployerSites = db.employerSites;

const getMessage = require("./errorCode").getMessage;

const STATE = {
  READY: 1,
  NOT_READY: 0,
  ERROR: -1
};
/**
 * Insert an employer
 * @param {*} employer 
 * @param {*} callback 
 */

const insert = (employer, callback) => {
  // Save Tutorial in the database
  Employer.create(employer).then(data => {
    callback(null, data);
  }).catch(err => {
    callback(err, getMessage(err));
  });
};
/**
 * Delete an employer
 * @param {*} employer 
 * @param {*} callback 
 */


const deleteEmployer = (employer, callback) => {
  Employer.destroy({
    where: {
      name: employer.NAME
    }
  }).then(data => {
    callback(null, data);
  }).catch(err => {
    callback(err, getMessage(err));
  });
};
/**
 * insert a new employer. if exists then first delete the old one and then insert.
 * @param {*} employer 
 * @param {*} callback (err, result)
 */


const insertEmployer = (employer, callback) => {
  // Save Tutorial in the database
  deleteEmployer(employer, (err, data) => {
    if (!err) insert(employer, callback);else callback(err, data);
  });
};
/**
 * Find employer by name
 * @param {string} name of the employer (company name)
 * @param {function} callback (err, result)
 */


const findByName = (name, callback) => {
  // find emp in the database
  Employer.findAll({
    where: {
      name: name
    }
  }).then(data => {
    callback(null, data);
  }).catch(err => {
    callback(err, getMessage(err));
  });
};
/**
 * Get all companies
 * @param {function} callback (err, result)
 */


const getAllComapnies = callback => {
  // find emp in the database
  Employer.findAll({
    include: [{
      model: EmployerSites,
      as: "Sites"
    }] //{ model: Employee, as: "Employees" }]

  }).then(data => {
    callback(null, data);
  }).catch(err => {
    callback(err, getMessage(err));
  });
};
/**
 * update employer with id equal to employerId with EMPLOYEES_READY = isReady.
 * @param {integer} employerId
 * @param {boolean} isReady
 */


const setEmploeeState = (employerId, state, callback) => {
  // Save Tutorial in the database
  Employer.update({
    'EMPLOYEES_READY': state
  }, {
    where: {
      id: employerId
    }
  }).then(data => {
    callback(null, data);
  }).catch(err => {
    callback(err, getMessage(err));
  });
};
/**
 * update employer with id equal to employerId with EMPLOYEES_READY = isReady.
 * @param {integer} employerId
 * @param {boolean} isReady
 */


const isFinishedWithEmployees = (employerId, callback) => {
  // Save Tutorial in the database
  Employer.findAll({
    where: {
      id: employerId
    }
  }).then(data => {
    result = false;
    if (data.length > 0) if (data[0].dataValues.EMPLOYEES_READY === STATE.READY) result = true;
    callback(null, result);
  }).catch(err => {
    callback(err, getMessage(err));
  });
};
/**
 * return SectorList
 */


const getAllSectors = callback => {
  // find emp in the database
  Sector.findAll().then(data => callback(null, data)).catch(err => {
    callback(err, getMessage(err));
  });
};

module.exports = {
  insertEmployer,
  deleteEmployer,
  findByName,
  getAllSectors,
  getAllComapnies,
  setEmploeeState,
  isFinishedWithEmployees,
  STATE
};