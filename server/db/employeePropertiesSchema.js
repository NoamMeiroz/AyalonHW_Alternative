const db = require("./database");
const EmployeeProperties = db.employeeProperties;

const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
  EmployeeProperties.findAll({
    order: [
      ['NAME', 'ASC'],
    ]
  }).then(data => { callback(null, data) })
    .catch(err => { callback(getMessage(err), false); });
};

module.exports = { getAll };