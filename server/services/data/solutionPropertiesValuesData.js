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

// /**
//  * get list of all localities
//  * @param {} data
//  */
// const updateSolutionMark = (solutionMark) => {
//   const errorCode = 400;
//   let message = null;
//   return new Promise(function (resolve, reject) {
//     if (!solutionMark.id || !isInteger(solutionMark.id))
//       message = "מזהה ציון חסר או אינו מספר";
//     if (!isValidNumber(solutionMark.AVG_AGREEMENT, 100, 0))
//         message = "ערך ממוצע הסכמה אינו בטווח המותר 0-100";
//     else if (!isValidNumber(solutionMark.MULTI, 100, 0))
//         message = "ערך מכפיל להחלשה/חיזוק אינו בטווח המותר 0-100";
//     else if (!isValidNumber(solutionMark.POSITIVE_MARK, 100, 0))
//         message = "ערך ציון חיובי אינו בטווח המותר 0-100";
//     else if (!isValidNumber(solutionMark.NEGATIVE_MARK, 0, -100))
//         message = `ערך ציון שלילי אינו בטווח המותר -100-0`;
//     else if (!isValidNumber(solutionMark.NUETRAL_MARK, 100, -100))
//         message = "ערך ציון נטרלי אינו בטווח המותר -100-100";
//     else if (!isValidNumber(solutionMark.DISQUALIFIED_MARK, 0, -1000000))
//         message = "ערך פתרון פסול אינו בטווח המותר -1000000-1000000";

//     if (message) return reject(new ServerError(errorCode, message));
    
//     solutionMarksSchema.updateSolutionMark(solutionMark, (err, data) => {
//       if (err) {
//         logger.error(err);
//         return reject(new ServerError(500, err));
//       }
//       resolve("update success");
//     });
//   });
// };

module.exports = { getAllSolutionPropertiesValues };
