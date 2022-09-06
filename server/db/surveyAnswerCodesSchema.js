const db = require("./database");
const SurveyAnswerCode = db.surveyAnswerCode;
const PropertyCategory = db.propertyCategories;

const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
  SurveyAnswerCode.findAll({
    include: [{ model: PropertyCategory, as: "PropertyCategory" }],
    order: [
      ['QUESTION_COLUMN_NAME', 'ASC'],
      ['ANSWER_VALUE', 'ASC']
    ]
  }).then(data => { callback(null, data) })
    .catch(err => { callback(getMessage(err), false); });
};

module.exports = { getAll };