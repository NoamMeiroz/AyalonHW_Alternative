const { sequelize, Sequelize } = require("./database");
const db = require("./database");
const solutions = db.solutions;
const solutionPropertryValues = db.solutionPropertyValues;
const propertyCategories = db.propertyCategories;
const employeeProperties = db.employeeProperties;

const getMessage = require("./errorCode").getMessage;

const getAll_old = (callback) => {
  solutionPropertryValues
    .findAll({
      include: [
        { model: solutions, as: "Solution" },
        { model: employeeProperties, as: "Property" },
      ],
    })
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(getMessage(err), false);
    });
};

const getAll = (callback) => {
  sequelize.query('SELECT spv.*, sol.NAME as SOLUTION, ep.NAME as PROPERTY, pc.NAME as CATEGORY FROM solution_property AS spv' +
    ' INNER JOIN solutions as sol ON sol.CODE = spv.SOLUTION_CODE ' +
    ' INNER JOIN employee_properties as ep ON ep.CODE = spv.PROPERTY_CODE ' +
    ' INNER JOIN property_categories as pc ON pc.PROPERTY_CODE = spv.PROPERTY_CODE AND pc.CATEGORY_CODE = spv.CATEGORY_CODE ',
    {
      model: solutionPropertryValues,
      mapToModel: true
    }).then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(getMessage(err), false);
    });
};


// const updateSolutionPropertyValues = (solutionMarkEntity, callback) => {
//   solutionPropertryValues.update({AVG_AGREEMENT: solutionMarkEntity.AVG_AGREEMENT,
//     MULTI: solutionMarkEntity.MULTI,
//     POSITIVE_MARK: solutionMarkEntity.POSITIVE_MARK,
//     NEGATIVE_MARK: solutionMarkEntity.NEGATIVE_MARK,
//     NUETRAL_MARK: solutionMarkEntity.NUETRAL_MARK,
//     DISQUALIFIED_MARK: solutionMarkEntity.DISQUALIFIED_MARK
//     },
//     {where: {id: solutionMarkEntity.id}}
//   ).then((data) => {
//     callback(null, data);
//   })
//   .catch((err) => {
//     callback(getMessage(err), false);
//   });
// };

module.exports = { getAll };
