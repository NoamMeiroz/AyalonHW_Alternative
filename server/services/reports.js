const axios = require('axios');
const { logger, ServerError } = require('../log');
const employeeSchema = require("../db/employeeSchema");
const reports = require("../db/reports");
const { SOLUTIONS_LIST, ROUTE_COLUMS} = require('./route');
const { employee } = require('../db/database');
/**
 * Check the data of the employer and then insert it to the database
 * if data is not valid then reject.
 * @param {} data 
 */
const getEmployeesOfEmployer = (employers, livingCity, workingCity,
	compounds,
	timeSlotWork, timeSlotHome, marks, destinationPolygon, startingPolygon) => {
	return new Promise(function (resolve, reject) {
		employeeSchema.getEmployees(employers, livingCity, workingCity, compounds,
			timeSlotWork, timeSlotHome, marks, destinationPolygon, startingPolygon, (err, payload) => {
				if (err) {
					logger.error(err.stack);
					return reject(new ServerError(500, "internal error"))
				}
				let employeesList = [];
				for (i in payload) {
					let employee = payload[i];
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

					if (employeesList[i].UPLOAD_ERROR === null) {
						// get distance and duration
						for (direction of ROUTE_COLUMS) {
							for (solution of SOLUTIONS_LIST) {
								if (employeesList[i][`${direction}_${solution.toUpperCase()}_DISTANCE`] === null)
									employeesList[i][`${direction}_${solution.toUpperCase()}_DISTANCE`] = 'נתונים חסרים';
								if (employeesList[i][`${direction}_${solution.toUpperCase()}_DURATION`] === null)
									employeesList[i][`${direction}_${solution.toUpperCase()}_DURATION`] = 'נתונים חסרים';
							}
						}
					}
					// remove unnecsacry columns
					delete employeesList[i].Site;
					delete employeesList[i].employer;
					delete employeesList[i].UPLOAD_ERROR;
				}
				resolve(employeesList);
			});
	});
}

/**
 * Check the data of the employer and then insert it to the database
 * if data is not valid then reject.
 * @param {} data 
 */
const getCluster = (employers, livingCity, workingCity,
	compounds,
	timeSlotWork, timeSlotHome, marks, destinationPolygon, startingPolygon, clusterBoundery) => {
	return new Promise(function (resolve, reject) {
		getEmployeesOfEmployer(employers, livingCity, workingCity,
			compounds,
			timeSlotWork, timeSlotHome, marks, destinationPolygon, startingPolygon)
			.then(empList => {
				if (empList.length === 0)
					return resolve(empList);
				let data = {
					maxCluster: clusterBoundery,
					employees: empList.map(employee => {
						return {
							id: employee.id,
							WORKER_ID: employee.WORKER_ID,
							EMPLOYER_ID: employee.EMPLOYER_ID,
							X: employee.X, Y: employee.Y
						//	WORK: {X: employee.WORK_X, Y: employee.WORK_Y}
						}
					})
				};
				let headers = { 'Content-Type': 'application/json' }
				let url = `http://${process.env.CLUSTERING_SERVER}:${process.env.CLUSTERING_PORT}`;
				axios.post(url, data, headers)
					.then(res => {
						let clusterList = [];
						for (let emp of res.data) {
							result = empList.filter(employee => {
								return employee.id === emp.id
							});
							result[0].cluster = emp.cluster;
							clusterList.push(result[0]);
						}
						resolve(clusterList);
					}).catch(error => {
						// return meaningful message about the error to the client
						let errorCode = 400;
						let message = "שגיאה פנימית במערכת";
						let res = error.response;
						if (res) {
							switch (res.data.code) {
								case 3000:
									message = "שגיאה פנימית במערכת";
									break;
								case 3001:
									message = "מספר העובדים המקסימלי לקלאסטר חייב להיות מספר חיובי ושלם";
									break;
								case 3002:
									message = "גודל קבוצת הצימוד חייב להיות נמוך או שווה למספר העובדים";
									break;
								case 3011:
									message = "דוח צימודים ניתן להפיק עבור 2 עובדים לפחות";
									break;
								default:
									message = "שגיאה לא יודעה בשירות דוח הצימודים";
									break;
							}
						}
						else {
							errorCode = 500;
							logger.error(error);
						}
						reject(new ServerError(errorCode, message));
					})
			})
			.catch(error => {
				console.log(error);
				reject(error);
			})
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

module.exports = { getEmployeesOfEmployer, getSharePotential, getCluster }