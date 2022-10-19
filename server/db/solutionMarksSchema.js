const db = require("./database");
const solutions = db.solutions;
const solutionMarks = db.solutionMarks;

const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
    solutionMarks
    .findAll({
      include: [
        { model: solutions, as: "Solution" },
      ],
   //   order: [["Solution.NAME", "ASC"]],
    })
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(getMessage(err), false);
    });
};

const updateSolutionMark = (solutionMarkEntity, callback) => {
  solutionMarks.update({AVG_AGREEMENT: solutionMarkEntity.AVG_AGREEMENT,
    MULTI: solutionMarkEntity.MULTI,
    POSITIVE_MARK: solutionMarkEntity.POSITIVE_MARK,
    NEGATIVE_MARK: solutionMarkEntity.NEGATIVE_MARK,
    NUETRAL_MARK: solutionMarkEntity.NUETRAL_MARK,
    DISQUALIFIED_MARK: solutionMarkEntity.DISQUALIFIED_MARK
    },
    {where: {id: solutionMarkEntity.id}}
  ).then((data) => {
    callback(null, data);
  })
  .catch((err) => {
    callback(getMessage(err), false);
  });
};

module.exports = { getAll, updateSolutionMark };