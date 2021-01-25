const { logger, ServerError } = require('../log');
const employeeSchema = require("../db/employeeSchema");
const reports = require("../db/reports");
const { getData } = require('./route');

const ROUTE_COLUMS = ["BEST_ROUTE_TO_HOME", "BEST_ROUTE_TO_WORK"];
const SOLUTIONS_LIST = ["walking", "bicycling", "driving", "transit"];

/**
 * Check the data of the employer and then insert it to the database
 * if data is not valid then reject.
 * @param {} data 
 */
const getEmployeesOfEmployer = (employers, livingCity, workingCity, timeSlotWork, timeSlotHome, marks) => {
	return new Promise(function (resolve, reject) {
		employeeSchema.getEmployees(employers, livingCity, workingCity,
			timeSlotWork, timeSlotHome, marks, (err, payload) => {
				if (err) {
					logger.error(err.stack);
					return reject(new ServerError(500, "internal error"))
				}
				let employeesList = [];
				for (i in payload) {
					employee = payload[i];
					employeesList[i] = employee.dataValues;
					// set work site information
					let workSite = employeesList[i].Site.dataValues;
					employeesList[i].WORK_X = workSite.X;
					employeesList[i].WORK_Y = workSite.Y;
					employeesList[i].WORK_CITY = workSite.ADDRESS_CITY;
					employeesList[i].WORK_STREET = workSite.ADDRESS_STREET;
					employeesList[i].WORK_BUILDING = workSite.ADDRESS_BUILDING_NUMBER;
					employeesList[i].SITE_NAME = workSite.NAME;
					// keep comapny name	
					employeesList[i].COMPANY = employeesList[i].employer.dataValues.NAME;
					// translate time slot id to meaningful text
					let timeSLot = employeesList[i].ExitHourToWork.dataValues;
					employeesList[i].EXIT_HOUR_TO_WORK = timeSLot.TIME_SLOT;

					// translate time slot id to meaningful text
					timeSLot = employeesList[i].ReturnHourToHome.dataValues;
					employeesList[i].RETURN_HOUR_TO_HOME = timeSLot.TIME_SLOT;

					if (employee.UPLOAD_ERROR === null) {
						// get distance and duration
						for (direction of ROUTE_COLUMS) {
							for (solution of SOLUTIONS_LIST) {
								let solutionData = null;
								if (employeesList[i][direction])
									solutionData = getData(employeesList[i][direction][solution]);
								if (solutionData) {
									employeesList[i][`${direction}_${solution.toUpperCase()}_DISTANCE`] = solutionData["distance"];
									employeesList[i][`${direction}_${solution.toUpperCase()}_DURATION`] = solutionData["duration"];
								}
								else {
									employeesList[i][`${direction}_${solution.toUpperCase()}_DISTANCE`] = 'נתונים חסרים';
									employeesList[i][`${direction}_${solution.toUpperCase()}_DURATION`] = 'נתונים חסרים';
								}
							}
						}
					}

					// remove unnecsacry columns
					delete employeesList[i].updatedAt;
					delete employeesList[i].createdAt;
					delete employeesList[i].Site;
					delete employeesList[i].employer;
					delete employeesList[i].BEST_ROUTE_TO_HOME;
					delete employeesList[i].BEST_ROUTE_TO_WORK;
					delete employeesList[i].UPLOAD_ERROR;
				}
				resolve(employeesList);
			});
	});
}

/**
 * return list of potential employers to cooperate where their
 * employees work in the same city of the given employer.
 * if data is not valid then reject.
 * @param {} data 
 */
const getSharePotential = (employerId) => {
	return new Promise(function (resolve, reject) {
		reports.getSharePotential(employerId, (err, payload) => {
			if (err) {
				logger.error(err.stack);
				return reject(new ServerError(500, "internal error"))
			}
			resolve(payload);
		});
	});
}

module.exports = { getEmployeesOfEmployer, getSharePotential }