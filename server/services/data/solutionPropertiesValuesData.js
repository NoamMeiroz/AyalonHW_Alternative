const { ServerError, logger } = require("../../log");
const solutionPropertiesValuesSchema = require("../../db/solutionPropertiesValuesSchema");
const { ERRORS } = require("../ERRORS");
const { isInteger, isValidNumber } = require("../../tools");

/**
 * get list of all localities
 * @param {} data
 */
const getAllSolutionPropertiesValues = () => {
  return new Promise(function (resolve, reject) {
    solutionPropertiesValuesSchema.getAll((err, data) => {
      if (err) {
        logger.error(err);
        return reject(new ServerError(500, err));
      }
      let resultList = [];
      if (data)
        resultList = data.map((solutionPropertiesValues) => {
          item = solutionPropertiesValues.dataValues;
          return item;
        });
      resolve(resultList);
    });
  });
};

/**
 * get list of all localities
 * @param {} data
 */
const updateSolutionPropertyValue = (solutionPorpertyValue) => {
  const errorCode = 400;
  let message = null;
  return new Promise(function (resolve, reject) {
    if (!solutionPorpertyValue.id || !isInteger(solutionPorpertyValue.id))
      message = "מזהה ציון חסר או אינו מספר";
    if (!isValidNumber(solutionPorpertyValue.VALUE, 100, 0))
        message = "אחוז הסכמה אינו בטווח המותר 0-100";

    if (message) return reject(new ServerError(errorCode, message));
    
    solutionPropertiesValuesSchema.updateSolutionPropertyValue(solutionPorpertyValue, (err, data) => {
      if (err) {
        logger.error(err);
        return reject(new ServerError(500, err));
      }
      resolve("update success");
    });
  });
};

module.exports = { getAllSolutionPropertiesValues, updateSolutionPropertyValue };
