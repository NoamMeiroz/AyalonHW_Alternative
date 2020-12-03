const db = require("./database");
const Locality = db.locality;
const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
    // Save Tutorial in the database
    Locality.findAll({
      order: [
        ['NAME', 'ASC']
      ]
    }).then(data=>{callback(null, data)})
      .catch(err=>{callback(getMessage(err), false);});
  };

const findByCode = (code, callback) => {
    // Save Tutorial in the database
    Locality.findOne({
      where: {
        code: code
      }
    }).then(data=>{callback(null, data)})
      .catch(err=>{callback(getMessage(err), false);});
  };

  module.exports = { findByCode, getAll };