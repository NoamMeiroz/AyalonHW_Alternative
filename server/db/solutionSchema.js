const db = require("./database");
const solutions = db.solutions;
const solutionMarks = db.solutionMarks;
const solutionLimits = db.solutionLimits;
const solutionPropertyValues = db.solutionPropertyValues;

const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
  solutions
    .findAll({
      include: [
        { model: solutionMarks, as: "markInformation" },
        { model: solutionLimits, as: "limits" },
        { model: solutionPropertyValues, as: "propertyValues" },
      ],
      order: [["NAME", "ASC"]],
    })
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(getMessage(err), false);
    });
};

module.exports = { getAll };
