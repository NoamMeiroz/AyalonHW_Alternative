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
    .then(data => { callback(null, data) })
    .catch(err => {
      callback(err, getMessage(err));
    });
};

/**
 * Delete all sites of employer
 * @param {*} employerId
 * @param {*} callback 
 */
const deleteSites = (employerId, callback) => {
  EmployerSites.destroy({ where: { employer_id: employerId } })
    .then(data => { callback(null, data) })
    .catch(err => {
      callback(err, getMessage(err));
    });
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
  EmployerSites.findAll({ where: { employer_id: employerId } })
    .then(data => { callback(null, data) })
    .catch(err => { callback(err, getMessage(err)); });
};

const getUniqueCompounds = (callback) => {
  EmployerSites.findAll({
    attributes: [[db.sequelize.fn('DISTINCT', 
      db.sequelize.col('compound')), 
      'NAME']],
    order: ['compound']
  })
  .then(data => { callback(null, data) })
  .catch(err => { callback(err, getMessage(err)); });
}

/**
 * Get all companies
 * @param {function} callback (err, result)
 */
 const updateDifficulties = (siteId, difficultiesReport, callback) => {
  // find emp in the database
  EmployerSites.update({TRAFFIC_JAMS: difficultiesReport.TRAFFIC_JAMS ?? 0,
    TRAVEL_COSTS: difficultiesReport.TRAVEL_COSTS ?? 0,
    LACK_OF_PARKING: difficultiesReport.LACK_OF_PARKING ?? 0,
    PARKING_COSTS: difficultiesReport.PARKING_COSTS ?? 0,
    WASTED_TRAVEL_TIME: difficultiesReport.WASTED_TRAVEL_TIME ?? 0,
    LACK_OF_PUBLIC_TRANSPORT: difficultiesReport.LACK_OF_PUBLIC_TRANSPORT ?? 0,
    PUBLIC_TRANSPORT_FREQUENCY: difficultiesReport.PUBLIC_TRANSPORT_FREQUENCY ?? 0,
    OTHER: difficultiesReport.OTHER ?? 0
  },
    { where: { id: siteId } })
    .then(data => { callback(null, data) })
    .catch(err => { callback(err, getMessage(err)); });
};

module.exports = { insertSites, getAllSites, deleteSites, getUniqueCompounds, updateDifficulties };