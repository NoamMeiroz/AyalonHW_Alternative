const { ServerError } = require("../log");
const db = require("./database");
const Employer = db.employer;
const Sector = db.sector;
const EmployerSites = db.employerSites;
const getMessage = require("./errorCode").getMessage;


const STATE = { READY: 1, NOT_READY:0, ERROR: -1};

/**
 * Insert an employer
 * @param {*} employer 
 * @param {*} callback 
 */
const insert = (employer, callback) => {
  // Save Tutorial in the database
  Employer.create(employer)
    .then(data => { callback(null, data) })
    .catch(err => {
      callback(err, getMessage(err));
    });
};

/**
 * delete employer by its id
 * @param {*} employerId 
 * @param {*} callback 
 */
const deleteEmployer = (employerId, callback) => {
  Employer.destroy({ where: { id: employerId } })
    .then(data => { callback(null, data) })
    .catch(err => {
      callback(err, getMessage(err));
    });
}

/**
 * Delete an employer
 * @param {*} employer 
 * @param {*} callback 
 */
const deleteEmployerByName = (employer, callback) => {
  Employer.destroy({ where: { name: employer.NAME } })
    .then(data => { callback(null, data) })
    .catch(err => {
      callback(err, getMessage(err));
    });
}

/**
 * insert a new employer. if exists then first delete the old one and then insert.
 * @param {*} employer 
 * @param {*} callback (err, result)
 */
const insertEmployer = (employer, callback) => {
  // Save Tutorial in the database
  deleteEmployerByName(employer, (err, data) => {
    if (!err)
      insert(employer, callback);
    else
      callback(err, data);
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
  }).then(data => { callback(null, data) })
    .catch(err => { callback(err, getMessage(err)); });
};

/**
 * Find employer by id
 * @param {number} id of the employer (company name)
 * @param {function} callback (err, result)
 */
const findByID = (id, callback) => {
  // find emp in the database
  Employer.findAll({
    where: {
      ID: id
    }
  }).then(data => { callback(null, data[0]) })
    .catch(err => { callback(err, getMessage(err)); });
};

/**
 * Get all companies
 * @param {function} callback (err, result)
 */
const getAllComapnies = (callback) => {
  // find emp in the database
  Employer.findAll({
    order: ['NAME'],
    include: [{ model: EmployerSites, as: "Sites" }]
  }).then(function(data) {
    countValidEmployees((err, result)=>{
      if (err)
        callback(err, result);
      else {
        callback(null, { companies: data, countValidEmployees: result})
      }
    });
  })
  .catch(err => { 
    callback(err, getMessage(err)); 
  });
};

/**
 * Count for each employer how many employees are in valid status (no error field in the UPLOAD_ERROR json object);
 * @param {*} callback 
 */
const countValidEmployees = (callback) => {
  db.sequelize.query("SELECT e.EMPLOYER_ID, count(*) validCount FROM alternative.employees e " +
     " where IFNULL(JSON_CONTAINS_PATH(e.UPLOAD_ERROR, 'one', '$.error'),0)=0 group by e.EMployer_id", 
     { type: db.Sequelize.QueryTypes.SELECT })
     .then(data => callback( null, data ))
     .catch( err => callback( err, getMessage(err)));
}

/**
 * update employer with id equal to employerId with EMPLOYEES_READY = isReady.
 * @param {integer} employerId
 * @param {boolean} isReady
 */
const setEmployeeState = (employerId, state, callback) => {
  // Save Tutorial in the database
  Employer.update({ 'EMPLOYEES_READY': state },
    { where: { id: employerId } }).then(data => { callback(null, data) })
    .catch(err => { callback(err, getMessage(err)); });
};

/**
 * return true if employee upload status is READY (finished)
 * @param {integer} employerId
 * @param {boolean} isReady
 */
const loadingStatus = (employerId, callback) => {
  // Save Tutorial in the database
  Employer.findAll({
    where: {
      id: employerId
    }
  }).then(data => {
    result = false;
    error = null;
    if (data.length > 0) {
      let state = data[0].dataValues.EMPLOYEES_READY;
      if (state === STATE.READY)
        result = true;
      else if (state === STATE.ERROR){
        rerult = true;
        error = new ServerError(500, "טעינת עובדים נכשלה. יש לפנות לתמיכה");
      }
    }
    callback(error, result)
  })
  .catch(err => { callback(err, getMessage(err)); });
};


/**
 * return SectorList
 */
const getAllSectors = (callback) => {
  // find emp in the database
  Sector.findAll().then(data => callback(null, data))
    .catch(err => {
      callback(err, getMessage(err));
    });
};

module.exports = {
  loadingStatus, insertEmployer, deleteEmployer, findByName, findByID,
  getAllSectors, getAllComapnies, setEmployeeState, STATE
};