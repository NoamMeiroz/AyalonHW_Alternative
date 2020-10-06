const { Worker } = require('worker_threads');
const { logger, ServerError } = require('../log');
const employeeSchema = require("../db/employeeSchema");
const employerSchema = require("../db/employerSchema");

function employeesService(workerData) {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./services/employeesLoadingWorker.js', { workerData });
		worker.on('message', resolve);
		worker.on('error', reject);
		worker.on('exit', (code) => {
			if (code !== 0)
				return reject(new ServerError(500, `Worker stopped with exit code ${code}`));
		})
	})
}

async function run(employer, employees) {
	logger.info(employer.NAME + ": Computing employees information...");
	let state = employerSchema.STATE.READY;
	//await employeesService({ employer, employees })
	try {
		result = await employeesService({ employer, employees });
		if (!result.Employees) {
			logger.error(result.message);
			state = employerSchema.STATE.ERROR;
		}
	}
	catch (error) {
		logger.error(error.stack);
		state = employerSchema.STATE.ERROR;
	}

	// finish working on employees
	employerSchema.setEmploeeState(employer.id, state,
		(err, result) => {
			if (result)
				logger.debug(JSON.stringify(result));
			else {
				logger.error(err.stack)
			}
		});
};

/**
 * Check the data of the employer and then insert it to the database
 * if data is not valid then reject.
 * @param {} data 
 */
const getEmployeesOfEmployer = (empId) => {
	return new Promise(function (resolve, reject) {
		employeeSchema.getEmployeesOfEmployer(empId, (err, payload) => {
			if (err) {
				logger.error(err.stack);
				return reject(new ServerError(500, "internal error"))
			}
			let employeesList = [];
			for (i in payload) {
				employee = payload[i];
				employeesList[i] = employee.dataValues;
				let workSite = employeesList[i].Site.dataValues
				employeesList[i].WORK_SITE = workSite.ADDRESS_STREET + " " +
					workSite.ADDRESS_BUILDING_NUMBER + ", " + workSite.ADDRESS_CITY;
				delete employeesList[i].updatedAt;
				delete employeesList[i].createdAt;
				delete employeesList[i].EMPLOYER_ID;
				delete employeesList[i].id;
				delete employeesList[i].Site;
			}
			resolve(employeesList);
		});
	});
}

const getPrecentFinished = (empId) => {
	return new Promise(function (resolve, reject) {
		employeeSchema.getPrecentFinished(empId, (err, payload) => {
			if (err) {
				logger.error(err.stack);
				reject(new ServerError(500, "internal error"))
			}
			resolve({ employerID: empId, precent: payload });
		});
	});
}

module.exports = { run, getEmployeesOfEmployer, getPrecentFinished }