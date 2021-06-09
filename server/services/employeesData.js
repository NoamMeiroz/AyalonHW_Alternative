const { Worker } = require('worker_threads');
const { logger, ServerError } = require('../log');
const employeeSchema = require("../db/employeeSchema");
const employerSchema = require("../db/employerSchema");
const { sendMessage } = require('../websocket');

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

async function run(req, employer, employees) {
	logger.info(employer.NAME + ": saving employees information...");
	const ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]; // get the ip of the client
	let state = employerSchema.STATE.READY;
	try {
		result = await employeesService({ employer, employees });
		if (!result.Employees) {
			state = employerSchema.STATE.ERROR;
		}
		else {
			let payload = result.Employees;
			logger.info(`upload result ${employer.NAME}: ${JSON.stringify(payload)}`);
			payload.employerID = employer.id;
			// notify client about the upload result; 
			sendMessage(ip, {type: "upload_result", payload: payload });
		}
	}
	catch (error) {
		logger.error(employer.NAME + ": saving employees information failed." + error.stack);
		state = employerSchema.STATE.ERROR;
	}
	// finish working on employees
	employerSchema.setEmployeeState(employer.id, state,
		(err, result) => {
			if (result)
				logger.debug("employee state is " + JSON.stringify(result));
			else {
				
				logger.error(err)
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
		employeeSchema.getEmployeesOfEmployer(empId, [], [], (err, payload) => {
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

				// translate time slot id to meaningful text
				let timeSLot = employeesList[i].ExitHourToWork.dataValues;
				employeesList[i].EXIT_HOUR_TO_WORK = timeSLot.TIME_SLOT;

				// translate time slot id to meaningful text
				timeSLot = employeesList[i].ReturnHourToHome.dataValues;
				employeesList[i].RETURN_HOUR_TO_HOME = timeSLot.TIME_SLOT;
				
				// remove column the client doesnt need
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
				reject(new ServerError(500, err))
			}
			resolve({ employerID: empId, precent: payload });
		});
	});
}

/**
 * 
 * @param {*} workerData 
 */
function recalculateService(workerData) {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./services/employeesUpdateWorker.js', { workerData });
		worker.on('message', resolve);
		worker.on('error', reject);
		worker.on('exit', (code) => {
			if (code !== 0)
				return reject(new ServerError(500, `Worker stopped with exit code ${code}`));
		})
	})
}


async function runRecalculate(req, employer, employees) {
	logger.info(employer.NAME + ": updating employees routes and marks...");
	const ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]; // get the ip of the client
	let state = employerSchema.STATE.READY;
	try {
		result = await recalculateService({ employer, employees });
		if (!result.Employees) {
			state = employerSchema.STATE.ERROR;
		}
		else {
			let payload = result.Employees;
			payload.employerID = employer.id;
			// notify client about the upload result; 
			sendMessage(ip, {type: "recalculate_result", payload: payload });
		}
	}
	catch (error) {
		logger.error(employer.NAME + ": saving employees information failed." + error.stack);
		state = employerSchema.STATE.ERROR;
	}
	// finish working on employees
	employerSchema.setEmployeeState(employer.id, state,
		(err, result) => {
			if (result)
				logger.debug("employee state is " + JSON.stringify(result));
			else {
				
				logger.error(err)
			}
		});
};

module.exports = { run, getEmployeesOfEmployer, getPrecentFinished, runRecalculate }