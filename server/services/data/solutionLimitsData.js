const { ServerError, logger } = require("../../log");
const solutionLimitsSchema = require("../../db/solutionLimitsSchema");
const { ERRORS } = require("../ERRORS");
const { isInteger, isValidNumber } = require("../../tools");

/**
 * get list of all localities
 * @param {} data
 */
const getAllSolutionLimits = () => {
  return new Promise(function (resolve, reject) {
    solutionLimitsSchema.getAll((err, data) => {
      if (err) {
        logger.error(err);
        return reject(new ServerError(500, err));
      }
      let resultList = [];
      if (data)
        resultList = data.map((solutionLimit) => {
          item = solutionLimit.dataValues;
          item.NAME = solutionLimit.Solution.dataValues.NAME;
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
const updateSolutionLimit = (solutionLimit) => {
  const errorCode = 400;
  let message = null;
  return new Promise(function (resolve, reject) {
    if (!solutionLimit.id || !isInteger(solutionLimit.id))
      message = "מזהה ציון חסר או אינו מספר";
    if (solutionLimit.TYPE==='BOOL') {
      if (solutionLimit.VALUE !== false && solutionLimit.VALUE !== true)
        message = "ערך המגבלה הינו 0 או 1 בלבד";
    }
    else if (solutionLimit.TYPE === 'INT')  {
        if (!isValidNumber(solutionLimit.VALUE, 1000000, 0))
            message = "ערך המגבלה אינו בטווח המותר 0-1000000";
    }
    else 
        message = "סוג המגבלה אינו חוקי";   
 

    if (message) return reject(new ServerError(errorCode, message));
    
    solutionLimitsSchema.updateSolutionLimit(solutionLimit, (err, data) => {
      if (err) {
        logger.error(err);
        return reject(new ServerError(500, err));
      }
      resolve("update success");
    });
  });
};

module.exports = { getAllSolutionLimits, updateSolutionLimit };
