const checkMinimumLivingInSameCity = (employee, solution, cityCount) => {
    limit = solution.limits.MINIMUM_LIVING_IN_SAME_CITY;
    return cityCount[employee.CITY] >= limit;
}

const checkLiveWorkSameCity = (employee, solution) => {
    if (solution.limits.LIVING_WORKING_IN_SAME_CITY)
        return employee.CITY === employee.WORK_CITY;
    else
        return true;
}

const checkMinimumExitToWorkInSameHour = (employee, solution, hoursCount) => {
    limit = solution.limits.MINIMUM_ARRIVING_IN_SAME_HOUR_TO_WORK;
    return hoursCount.exitToWork[employee.EXIT_HOUR_TO_WORK] >= limit;
}

const checkMinimumRuturnToHomeInSameHour = (employee, solution, hoursCount) => {
    limit = solution.limits.MINIMUM_EXIT_FROM_WORK_IN_SAME_HOUR;
    return hoursCount.returnToHome[employee.RETURN_HOUR_TO_HOME] >= limit;
}

const checkLimits = (employee, solutions, cityCount, hoursCount) => {
  solutions.forEach( solution => {
    isDisqualified = false;
    if (!isDisqualified && !checkMinimumLivingInSameCity(employee, solution, cityCount)) {
        isDisqualified = true;
    }
    if (!isDisqualified && !checkLiveWorkSameCity(employee, solution)) {
        isDisqualified = true;
    }
    if (!isDisqualified && !checkMinimumExitToWorkInSameHour(employee, solution, hoursCount)) {
        isDisqualified = true;
    }
    if (!isDisqualified && !checkMinimumRuturnToHomeInSameHour(employee, solution, hoursCount)) {
        isDisqualified = true;
    }
    if (isDisqualified)
        employee[solution.OBJ_COLUMN_NAME] = solution.markInformation.DISQUALIFIED_MARK;
  })
  return employee;
}


module.exports = { checkLimits };
