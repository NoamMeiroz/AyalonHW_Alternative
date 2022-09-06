const e = require("cors");

const convertAnswerToCategory = (
  solution,
  propertyCode,
  questionName,
  questionType,
  propertiesCategories,
  surveyAnswerCode,
  answer
) => {
  category = 0;
  if (questionType === "string")
    category = surveyAnswerCode[questionName][answer]["CATEGORY_CODE"];
  else if (questionType === "int") {
    categories = propertiesCategories[propertyCode];
    category = categories.filter(
      (propCategory) =>
        answer >= propCategory.MIN_VALUE && answer <= propCategory.MAX_VALUE
    )[0]["CATEGORY_CODE"];
  }
  return category;
};

const convertCategoryToPrecent = (solution, propertyCode, categoryCode) => {
  return solution.propertyValues[propertyCode][categoryCode];
};

const findAvgMark = (solution, propertyCode) => {
  let result = 0;
  solution.propertyValues[propertyCode].forEach((categoryCode) => {
    result += solution.propertyValues[propertyCode][categoryCode];
  });
  result = result / solution.propertyValues[propertyCode].length;
  return result;
};

const computeSolutionRange = (markInformation) => {
  let valueToAdd = (markInformation.AVG_AGREEMENT * markInformation.MULTI)/100;
  return valueToAdd;
}

const calculatePorpertyAddition = (
          solution,
          answerValue
        ) => {
  let addition = 0;
  const valueToadd = computeSolutionRange(solution.markInformation);
  if (answerValue >= solution.markInformation.AVG_AGREEMENT+valueToadd)
    addition = solution.markInformation.POSITIVE_MARK;
  else if (answerValue <= solution.markInformation.AVG_AGREEMENT+(-1 * valueToadd))
    addition = solution.markInformation.NEGATIVE_MARK;
  else 
    addition = solution.markInformation.NUETRAL_MARK;      
  return addition;
};

const calculateMarks = (
  employee,
  cityCount,
  config,
  solutions,
  surveyAnswerCode,
  employeeProperties,
  propertiesCategories
) => {
  // for each solution
  solutions.forEach((solution) => {
    let solutionMark = 0;
    // loop on each property
    employeeProperties.forEach((property) => {
      let convertedValue = 0;
      // calculate marks only on properties that are flaged
      if (property.IS_INCLUDED_IN_MARK) {
        answer = employee[property.OBJ_COLUMN_NAME];
        if (answer) {
          convertedCategory = convertAnswerToCategory(
            solution,
            property.CODE,
            property.OBJ_COLUMN_NAME,
            property.TYPE,
            propertiesCategories,
            surveyAnswerCode,
            answer
          );
          convertedValue = convertCategoryToPrecent(
            solution,
            property.CODE,
            convertedCategory
          );
        } else {
          // findAvgMark when there is no answer
          convertedValue = findAvgMark(solution, property.CODE);
        }
        solutionMark += calculatePorpertyAddition(
          solution,
          convertedValue
        );
      }
    });
    employee[solution.OBJ_COLUMN_NAME] = solutionMark;
  });

  return employee;
};

module.exports = { calculateMarks };
