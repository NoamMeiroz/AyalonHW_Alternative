const { ServerError, logger } = require("../../log");
const solutionSchema = require("../../db/solutionSchema");
const { ERRORS } = require("../ERRORS");

const PROPERTY_CODE_FIELD_NAME = "PROPERTY_CODE";
const CATEGORY_CODE_FIELD_NAME = "CATEGORY_CODE";
const VALUE_FIELD_NAME = "VALUE";

/**
 * convert solutionPropertyValues from rows to an object that each item is an property.
 * In each property each item is a category with the Value.
 * @param {*} propertyValues 
 * @returns 
 */
const populatePropertyValues = (propertyValues) => {
  let propertyList = {};

  if (!propertyValues) return null;
  propertyValues.forEach((property) => {
    if (!propertyList[property.dataValues[PROPERTY_CODE_FIELD_NAME]])
      propertyList[property.dataValues[PROPERTY_CODE_FIELD_NAME]] = {};
    propertyList[property.dataValues[PROPERTY_CODE_FIELD_NAME]][
      property.dataValues[CATEGORY_CODE_FIELD_NAME]
    ] = property.dataValues[VALUE_FIELD_NAME];
  });
  return propertyList;
};

/**
 * get list of all localities
 * @param {} data
 */
const getAllSolutions = () => {
  return new Promise(function (resolve, reject) {
    solutionSchema.getAll((err, data) => {
      if (err) {
        logger.error(err);
        return reject(new ServerError(500, err));
      }
      let resultList = [];
      if (data)
        resultList = data.map((solution) => {
          item = solution.dataValues;
          item.markInformation = solution.markInformation.dataValues;
          item.limits = solution.limits.map((limit) => limit.dataValues);
          item.propertyValues = populatePropertyValues(solution.propertyValues);
          return item;
        });
      resolve(resultList);
    });
  });
};

module.exports = { getAllSolutions };
