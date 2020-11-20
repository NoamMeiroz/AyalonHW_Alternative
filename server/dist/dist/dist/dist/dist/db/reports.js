const db = require("./database");

const QueryTypes = db.sequelize.QueryTypes;

const {
  getMessage
} = require("./errorCode");
/**
 * Insert employee object
 * @param {*} employee 
 * @param {*} callback 
 */


const getSharePotential = (employerId, callback) => {
  db.sequelize.query("select emp.NAME as COMPANY, es.EMPLOYER_ID, e.CITY as LIVING_CITY, es.ADDRESS_CITY as WORK_CITY, COUNT(*) AS COUNTER " + "from employees e, employers_sites es, employers emp " + "where emp.ID = es.EMPLOYER_ID " + "AND e.EMPLOYER_ID = es.EMPLOYER_ID " + "AND es.id = e.WORK_SITE " + "AND es.ADDRESS_CITY in ( " + "SELECT es1.ADDRESS_CITY " + "FROM employers_sites es1 " + "WHERE es1.EMPLOYER_ID = $1) " + "GROUP BY WORK_CITY, LIVING_CITY, es.employer_id " + "ORDER BY WORK_CITY, COUNTER DESC, COMPANY", {
    bind: [employerId],
    type: QueryTypes.SELECT
  }).then(data => {
    callback(null, data);
  }).catch(err => {
    callback(err, getMessage(err));
  });
  ;
};

module.exports = {
  getSharePotential
};