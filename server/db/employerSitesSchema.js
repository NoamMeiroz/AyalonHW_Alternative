const db = require("./database");
const EmployerSites = db.employerSites;
const getMessage = require("./errorCode").getMessage;

/**
 * Insert a list of new sites (branch, headquarter and etc)
 * @param {*} employerSite 
 * @param {*} callback 
 */
const insertBulk = (sites, callback) => {
  
    // Save in the database
    EmployerSites.bulkCreate(sites)
      .then(data=>{callback(null, data)})
      .catch(err=>{ 
          callback(err, getMessage(err));});
  };

/**
 * Delete all sites of employer
 * @param {*} employerID
 * @param {*} callback 
 */
const deleteSites = (employerID, callback) => {
    EmployerSites.destroy({ where: { employer_id: employerID }})
        .then(data=>{callback(null, data)})
        .catch(err=>{ 
            callback(err, getMessage(err));});
}

/**
 * insert list of sites. if exists then first delete the old sites and then insert.
 * @param {*} employerId
 * @param {*} sites
 * @param {*} callback (err, result)
 */
const insertSites = (employerId, sites, callback) => {
    // Save Tutorial in the database
    deleteSites(employerId, (err, data) => {
        if (!err)
            insertBulk(sites, callback);
        else
            callback(err, data);
    });
  };

/**
 * Get all companies
 * @param {function} callback (err, result)
 */
const getAllSites = (employerId, callback) => {
  // find emp in the database
  EmployerSites.findAll({ where : { employer_id: employerId }})
    .then(data=>{callback(null, data)})
    .catch(err=>{callback(err, getMessage(err));});
};

module.exports = { insertSites, getAllSites, deleteSites};