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
			let payload = checkResult(result.Employees);
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
 * Check count employess that have no error in the best_route feature.
 * @param {employeesList} employessList 
 */
const checkResult = (employessList) => {
	let successCount = 0;
	let total = employessList.length;

	for ( emp of employessList ) {
		if (!emp.dataValues.BEST_ROUTE.error) 
			successCount = successCount + 1;
	}
	return { successCount: successCount, total: total};
}

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