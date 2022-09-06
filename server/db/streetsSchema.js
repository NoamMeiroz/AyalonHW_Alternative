const db = require("./database");
const Street = db.street;
const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
  // Save Tutorial in the database
  Street.findAll({
    order: [
      ['LOCALITY_NAME', 'ASC'],
      ['STREET_NAME', 'ASC']
    ]
  }).then(data => { callback(null, data) })
    .catch(err => { callback(getMessage(err), false); });
};

const findByCode = ( locality_code, street_code, callback) => {
  Street.findOne({
    where: {
      locality: locality_code,
      code: street_code
    }
  }).then(data => { callback(null, data) })
    .catch(err => { callback(getMessage(err), false); });
};

module.exports = { findByCode, getAll };