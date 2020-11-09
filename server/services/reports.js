const { Worker } = require('worker_threads');
const { logger, ServerError } = require('../log');
const employeeSchema = require("../db/employeeSchema");
const reports = require("../db/reports");

/**
 * Check the data of the employer and then insert it to the database
 * if data is not valid then reject.
 * @param {} data 
 */
const getEmployeesOfEmployer = (employers, livingCity, workingCity) => {
	return new Promise(function (resolve, reject) {
		employeeSchema.getEmployees(employers, livingCity, workingCity, (err, payload) => {
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
				employeesList[i].SITE_NAME = workSite.NAME;
				// keep comapny name
				
				employeesList[i].COMPANY = employeesList[i].employer.dataValues.NAME;
				// remove unnecsacry columns
				delete employeesList[i].updatedAt;
				delete employeesList[i].createdAt;
				delete employeesList[i].id;
				delete employeesList[i].Site;
				delete employeesList[i].employer;
				delete employeesList[i].BEST_ROUTE;
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