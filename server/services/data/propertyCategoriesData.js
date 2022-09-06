const { ServerError, logger } = require("../../log");
const propertyCategoriesSchema = require("../../db/propertyCategoriesSchema");
const { ERRORS } = require("../ERRORS");

const PROPERTY_CODE_FIELD_NAME = "PROPERTY_CODE";

/**
 * get list of all localities
 * @param {} data
 */
const getAllProperties = () => {
  return new Promise(function (resolve, reject) {
    propertyCategoriesSchema.getAll((err, data) => {
      if (err) {
        logger.error(err);
        return reject(new ServerError(500, err));
      }
      let propertyList = {};
      if (data) {
        data.forEach((property) => {
          if (!propertyList[property.dataValues[PROPERTY_CODE_FIELD_NAME]])
            propertyList[property.dataValues[PROPERTY_CODE_FIELD_NAME]] = [];
          propertyList[property.dataValues[PROPERTY_CODE_FIELD_NAME]].push(
            property.dataValues
          );
        });
      }
      resolve(propertyList);
    });
  });
};

module.exports = { getAllProperties };
