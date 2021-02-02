
/**
 * return the fastest routes
 * @param {array of routes} route 
 */
findFastestRoute = (route) => {
    let bestRoute = route[0];
    for (let i = 1; i < route.length; i++) {
        if (route[i].legs[0].duration.value < bestRoute.legs[0].duration.value)
            bestRoute = route[i];
    }
    return bestRoute;
}

/**
 * convert google driving route recommendation to meaningful string
 * @param {json} bicycleDescription 
 */
const getData = (route) => {
    if (!route)
        return null;
    if (route.error)
        return null;
    let bestRoute = findFastestRoute(route);
    if (!bestRoute)
        return null;

    let result = { duration: Math.floor(bestRoute.legs[0].duration.value / 60), distance: bestRoute.legs[0].distance.value };
    return result;
}

/**
 * return a value of specific variable by its name
 */
const getConfigValue = (config, name) => {
    return parseInt(config.find(item => item.NAME === name).VALUE);
}

/**
 * if driving is short then fail walking, scooter and bicycle solution if they are taking
 * to long then threshold (from configuration table)
 * repeate if driving duration is medium or long.
 * @param {*} employee 
 * @param {column name} direction 
 * @param {*} config 
 */
const calculate = (employee, direction, config) => {
    if (employee.UPLOAD_ERROR !== null)
        return employee;

    failedGrade = getConfigValue(config, "failed grade");

    const drivingData = getData(employee[direction].driving);
    // if driving data is empty then we don't have any route data for driving and
    // we can't calculate grades.
    if (!drivingData)
        return employee;
    const transitData = getData(employee[direction].transit);
    const walkingData = getData(employee[direction].walking);
    const bicyclingData = getData(employee[direction].bicycling);
    const scooterData = getData(employee[direction].bicycling);
    // if driving is short then calcalute short threshold
    if (drivingData.duration <= getConfigValue(config, "short driving limit")) {
        if (transitData && (transitData.duration - drivingData.duration > getConfigValue(config, "transport limit short")))
            employee.FINAL_PUBLIC_TRANSPORT_GRADE = failedGrade;
        if (walkingData && (walkingData.duration - drivingData.duration > getConfigValue(config, "walking limit short")))
            employee.FINAL_WALKING_GRADE = failedGrade;
        if (bicyclingData && (bicyclingData.duration - drivingData.duration > getConfigValue(config, "bicycle limit short")))
            employee.FINAL_BICYCLE_GRADE = failedGrade;
        if (scooterData && (scooterData.duration - drivingData.duration > getConfigValue(config, "scooter limit short")))
            employee.FINAL_SCOOTER_GRADE = failedGrade;
    }
    // if driving is short then calcalute medium threshold
    else if (drivingData.duration <= getConfigValue(config, "medium driving limit")) {
        if (transitData && (transitData.duration - drivingData.duration > getConfigValue(config, "transport limit medium")))
            employee.FINAL_PUBLIC_TRANSPORT_GRADE = failedGrade;
        if (walkingData && (walkingData.duration - drivingData.duration > getConfigValue(config, "walking limit medium")))
            employee.FINAL_WALKING_GRADE = failedGrade;
        if (bicyclingData && (bicyclingData.duration - drivingData.duration > getConfigValue(config, "bicycle limit medium")))
            employee.FINAL_BICYCLE_GRADE = failedGrade;
        if (scooterData && (scooterData.duration - drivingData.duration > getConfigValue(config, "scooter limit medium")))
            employee.FINAL_SCOOTER_GRADE = failedGrade;
    }
    // if driving is short then calcalute long threshold
    else if (drivingData.duration >= getConfigValue(config, "long driving limit")) {
        if (transitData && (transitData.duration - drivingData.duration > getConfigValue(config, "transport limit long")))
            employee.FINAL_PUBLIC_TRANSPORT_GRADE = failedGrade;
        if (walkingData && (walkingData.duration - drivingData.duration > getConfigValue(config, "walking limit long")))
            employee.FINAL_WALKING_GRADE = failedGrade;
        if (bicyclingData && (bicyclingData.duration - drivingData.duration > getConfigValue(config, "bicycle limit long")))
            employee.FINAL_BICYCLE_GRADE = failedGrade;
        if (scooterData && (scooterData.duration - drivingData.duration > getConfigValue(config, "scooter limit long")))
            employee.FINAL_SCOOTER_GRADE = failedGrade;
    }

    return employee;
}

/**
 * calculate mark for an employee.
 * Check mark for each direction.
 * @param {*} employee 
 * @param {*} config 
 */
const calculateMark = (employee, config) => {
    if (employee.UPLOAD_ERROR !== null)
        return employee;

    employee = calculate(employee, "BEST_ROUTE_TO_WORK", config);
    employee = calculate(employee, "BEST_ROUTE_TO_HOME", config);
    return employee;
}


module.exports = { calculateMark, getData };