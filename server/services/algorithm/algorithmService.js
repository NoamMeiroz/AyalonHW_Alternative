const { propertyCategories } = require("../../db/database");
const { ServerError, logger } = require("../../log");
const { ERRORS } = require("../ERRORS");
const { calculateMarkFromRoute, getConfigValue } = require("../route");
const { checkLimits } = require("./solutionLimitsService");

/**
 * if questionType is of type int then answer is converted to category by its range.
 * if questionType is of type category then answer is matached to a category.
 * if questionType is of type string then category is 0.
 * @param {*} propertyCode
 * @param {*} questionName
 * @param {*} questionType
 * @param {*} propertiesCategories
 * @param {*} surveyAnswerCode
 * @param {*} answer
 * @returns
 */
const convertAnswerToCategory = (
  propertyCode,
  questionName,
  questionType,
  propertiesCategories,
  surveyAnswerCode,
  answer
) => {
  category = 0;
  if (questionType === "category")
    category = surveyAnswerCode[questionName][answer]["CATEGORY_CODE"];
  else if (questionType === "int") {
    categories = propertiesCategories[propertyCode];
    category = categories.filter(
      (propCategory) =>
        answer >= propCategory.MIN_VALUE && answer <= propCategory.MAX_VALUE
    )[0]["CATEGORY_CODE"];
  } else if (questionType === "string") {
    category = 0;
  }
  return category;
};

const convertCategoryToPrecent = (solution, propertyCode, categoryCode) => {
  return solution.propertyValues[propertyCode][categoryCode];
};

/**
 * return the avg precent from all categories of the property.
 * @param {*} solution
 * @param {*} propertyCode
 * @returns
 */
const findAvgPrecent = (solution, propertyCode) => {
  let result = 0;
  for (const [categoryCode, value] of Object.entries(
    solution.propertyValues[propertyCode]
  )) {
    result += value;
  }
  result = result / Object.keys(solution.propertyValues[propertyCode]).length;
  return result;
};

const computeSolutionRange = (markInformation) => {
  let valueToAdd =
    (markInformation.AVG_AGREEMENT * markInformation.MULTI) / 100;
  return valueToAdd;
};

const calculatePorpertyAddition = (solution, convertedPrecent) => {
  let addition = 0;
  const valueToadd = computeSolutionRange(solution.markInformation);
  if (convertedPrecent >= solution.markInformation.AVG_AGREEMENT + valueToadd)
    addition = solution.markInformation.POSITIVE_MARK;
  else if (
    convertedPrecent <=
    solution.markInformation.AVG_AGREEMENT + -1 * valueToadd
  )
    addition = solution.markInformation.NEGATIVE_MARK;
  else addition = solution.markInformation.NUETRAL_MARK;
  return addition;
};

const translatePreferedSolutions = (
  employee,
  employeeProperties,
  propertiesCategories,
  surveyAnswerCode
) => {
  let preferedSolutions = [];
  if (employee.PREFERED_SULOTIONS) {
    const property = employeeProperties.filter(
      (property) => property.OBJ_COLUMN_NAME === "PREFERED_SULOTIONS"
    );
    if (property) {
      try {
        preferedSolutions = employee.PREFERED_SULOTIONS.split(", ").map(
          (answer) => {
            category = convertAnswerToCategory(
              property[0].CODE,
              property[0].OBJ_COLUMN_NAME,
              property[0].TYPE,
              propertiesCategories,
              surveyAnswerCode,
              parseInt(answer)
            );
            return propertiesCategories[property[0].CODE].filter(
              (propertyCategory) => propertyCategory.CATEGORY_CODE === category
            )[0];
          }
        );
      } catch (error) {
        logger.error(error.stack);
        employee.UPLOAD_ERROR = {error: `הערך ${
          employee.PREFERED_SULOTIONS
        } ב ${"פתרונות תחבורה אותם אהיה מוכנ/ה לשקול כדי להגיע ולחזור ממקום העבודה"} אינו תקין`};
      }
    } else
      throw new ServerError(ERRORS.MISSING_EMPLOYEE_PROPERTIES, "PREFERED_SULOTIONS");
  }
  return preferedSolutions;
};

/**
 * Translate preferedSolutions answer to Prefered Solution objects.
 * If Prefered Solution is marked as disqualified then ignore it.
 * Arrange remaining Prefered solutions in the top five solutoins columns accurding their rank
 * Add solutions that are not disaulified to the top five solutions accurding their rank.
 * @param {*} employee
 * @param {*} config
 * @param {*} solutions
 * @param {*} employeeProperties
 * @param {*} propertiesCategories
 * @param {*} surveyAnswerCode
 * @returns
 */
const findTopFiveSolutions = (
  employee,
  config,
  solutions,
  employeeProperties,
  propertiesCategories,
  surveyAnswerCode
) => {
  let solutionList = [];
  let isIncluded = {};
  // translt prefered solutions to Solutions objects
  const preferedSolutions = translatePreferedSolutions(
    employee,
    employeeProperties,
    propertiesCategories,
    surveyAnswerCode
  );
  if (preferedSolutions && preferedSolutions.length > 0) {
    // check if prefered solutions is not disqualified
    preferedSolutions.forEach((preferedSolution) => {
      let solution = solutions.filter(
        (solution) => solution.NAME === preferedSolution.NAME
      );
      if (solution) {
        if (
          employee[solution[0].OBJ_COLUMN_NAME] !==
          getConfigValue(config, "failed grade")
        ) {
          solutionList.push(solution[0]);
          isIncluded[solution[0].NAME] = 1;
        }
      }
    });
    // sort by SURVY RANK
    solutionList.sort((a, b) =>
      a.SURVAY_RANK > b.SURVAY_RANK ? -1 : b.SURVAY_RANK > a.SURVAY_RANK ? 1 : 0
    );
  }
  // set top_Solutions columns with prefered solutions
  let lastTopSolution = 0;
  initTop5Solutions();

  // set remaining top_solutions with other solutions
  solutionList = [];
  solutions.forEach((solution) => {
    if (
      employee[solution.OBJ_COLUMN_NAME] !==
        getConfigValue(config, "failed grade") &&
      !isIncluded[solution.NAME]
    ) {
      solutionList.push(solution);
      isIncluded[solution.NAME] = 1;
    }
  });
  // sort by mark and SURVY RANK
  solutionList.sort((a, b) => {
    let result = employee[a.OBJ_COLUMN_NAME] > employee[b.OBJ_COLUMN_NAME] ? -1 : employee[b.OBJ_COLUMN_NAME] > employee[a.OBJ_COLUMN_NAME] ? 1 : 0;
    if (result === 0)
      result = a.SURVAY_RANK > b.SURVAY_RANK ? -1 : b.SURVAY_RANK > a.SURVAY_RANK ? 1 : 0;
    return result
    }
  )
  initTop5Solutions();
  
  return employee;

  function initTop5Solutions() {
    if (solutionList) {
      solutionList.forEach((solution) => {
        lastTopSolution++;
        if (lastTopSolution <= 5)
          employee[`TOP_SOLUTION_${lastTopSolution}`] = solution.NAME;
      });
    }
  }
};

const calculateMarks = (
  employee,
  cityCount,
  hoursCount,
  config,
  solutions,
  surveyAnswerCode,
  employeeProperties,
  propertiesCategories
) => {
  if (employee.UPLOAD_ERROR !== null) return employee;

  // for each solution
  solutions.forEach((solution) => {
    let solutionMark = 0;
    // loop on each property
    employeeProperties.forEach((property) => {
      let convertedPrecent = 0;
      // calculate marks only on properties that are flaged
      if (property.IS_INCLUDED_IN_MARK) {
        answer = employee[property.OBJ_COLUMN_NAME];
        if (answer) {
          // find answer catagory
          convertedCategory = convertAnswerToCategory(
            property.CODE,
            property.OBJ_COLUMN_NAME,
            property.TYPE,
            propertiesCategories,
            surveyAnswerCode,
            answer
          );
          // find precent related to categor
          convertedPrecent = convertCategoryToPrecent(
            solution,
            property.CODE,
            convertedCategory
          );
        } else {
          // findAvgMark when there is no answer
          convertedPrecent = findAvgPrecent(solution, property.CODE);
        }
        // calculate value
        solutionMark += calculatePorpertyAddition(solution, convertedPrecent);
      }
    });
    employee[solution.OBJ_COLUMN_NAME] = solutionMark;
  });

  // disqualify marks by limits
  employee = checkLimits(employee, solutions, cityCount, hoursCount);
  // disqualify marks by trave times
  employee = calculateMarkFromRoute(employee, config);

  // find top 5 solutions
  employee = findTopFiveSolutions(
    employee,
    config,
    solutions,
    employeeProperties,
    propertiesCategories,
    surveyAnswerCode
  );
  return employee;
};

module.exports = { calculateMarks };
