const db = require("./database");
const { getMessage } = require("./errorCode");
const EmployeeSurveyAnswers = db.employeeSurveyAnswers;

/**
 * Insert employee object
 * @param {*} employee
 * @param {*} callback
 */
const insert = (employeeSurveyAnswer, callback) => {
  // Save in the database
  EmployeeSurveyAnswers.create(employeeSurveyAnswer)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, getMessage(err));
    });
};

/**
 * Insert a bulk of emplyees with one sql statement
 * @param {*} employees
 * @param {*} callback
 */
const insertBulk = (employeeSurveyAnswers, callback) => {
  // Save  in the database
  EmployeeSurveyAnswers.bulkCreate(employeeSurveyAnswers)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, getMessage(err));
    });
};

module.exports = {
    insertBulk,
    insert
  };