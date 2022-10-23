const { sequelize, Sequelize } = require("./database");
const db = require("./database");
const solutionPropertryValues = db.solutionPropertyValues;

const getMessage = require("./errorCode").getMessage;

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


const updateSolutionPropertyValue = (solutionPropertyValue, callback) => {
  solutionPropertryValues.update({VALUE: solutionPropertyValue.VALUE},
    {where: {id: solutionPropertyValue.id}}
  ).then((data) => {
    callback(null, data);
  })
  .catch((err) => {
    callback(getMessage(err), false);
  });
};

module.exports = { getAll, updateSolutionPropertyValue };
