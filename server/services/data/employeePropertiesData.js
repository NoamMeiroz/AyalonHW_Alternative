const { ServerError, logger } = require("../../log");
const employeePropertiesschema = require("../../db/employeePropertiesSchema.js");
const { ERRORS } = require("../ERRORS");

/**
 * get list of all localities
 * @param {} data
 */
const getAllProperties = () => {
  return new Promise(function (resolve, reject) {
    employeePropertiesschema.getAll((err, data) => {
      if (err) {
        logger.error(err);
        return reject(new ServerError(500, err));
      }
      let resultList = [];
      if (data)
        resultList = data.map((property) => property.dataValues);
      resolve(resultList);
    });
  });
};

module.exports = { getAllProperties };
