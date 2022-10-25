const db = require("./database");
const solutions = db.solutions;
const solutionLimits = db.solutionLimits;

const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
    solutionLimits
    .findAll({
      include: [
        { model: solutions, as: "Solution" },
      ],
    })
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(getMessage(err), false);
    });
};

const updateSolutionLimit = (solutionLimit, callback) => {
  solutionLimits.update({VALUE: solutionLimit.VALUE,
    },
    {where: {id: solutionLimit.id, TYPE: solutionLimit.TYPE}}
  ).then((data) => {
    callback(null, data);
  })
  .catch((err) => {
    callback(getMessage(err), false);
  });
};

module.exports = { getAll, updateSolutionLimit };