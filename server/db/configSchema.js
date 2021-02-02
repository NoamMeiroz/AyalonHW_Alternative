const db = require("./database");
const Configuration = db.configuration;
const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
    // Save Tutorial in the database
    Configuration.findAll({
      order: [
        ['NAME', 'ASC']
      ]
    }).then(data=>{callback(null, data)})
      .catch(err=>{callback(getMessage(err), false);});
  };

  module.exports = { getAll };