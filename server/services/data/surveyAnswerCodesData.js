const { ServerError, logger } = require("../../log");
const surveyAnswerCodesSchema = require("../../db/surveyAnswerCodesSchema");
const { ERRORS } = require("../ERRORS");

const QUESTION_COLOMN_NAME = "QUESTION_COLUMN_NAME";
const ANSWER_VALUE = "ANSWER_VALUE";

/**
 * get list of all localities
 * @param {} data
 */
const getAllSurveyAnswerCodes = () => {
  return new Promise(function (resolve, reject) {
    surveyAnswerCodesSchema.getAll((err, data) => {
      if (err) {
        logger.error(err);
        return reject(new ServerError(500, err));
      }
      let resultList = {};
      if (data) {
        // resultList = data.map((surveyAnswerCode) => {
        //   item = surveyAnswerCode.dataValues;
        //   item.PropertyCategory =
        //     surveyAnswerCode.PropertyCategory.dataValues;
        //   return item;
        // });

        data.forEach((surveyAnswerCode) => {
          if (!resultList[surveyAnswerCode.dataValues[QUESTION_COLOMN_NAME]])
            resultList[surveyAnswerCode.dataValues[QUESTION_COLOMN_NAME]] = {};
          resultList[surveyAnswerCode.dataValues[QUESTION_COLOMN_NAME]]
            [surveyAnswerCode.dataValues[ANSWER_VALUE]] = surveyAnswerCode.PropertyCategory.dataValues;
        });
      }
      resolve(resultList);
    });
  });
};

module.exports = { getAllSurveyAnswerCodes };
