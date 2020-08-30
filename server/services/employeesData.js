const { Worker } = require('worker_threads');
const { logger, ServerError } = require('../log');

const employeeSchema = require("../db/employeeSchema");
const employerSchema = require("../db/employerSchema");
const { sleep } = require("../tools")


//const { resolve } = require('app-root-path');

function employeesService(workerData) {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./services/handleEmployee.js', { workerData });
		worker.on('message', resolve);
		worker.on('error', reject);
		worker.on('exit', (code) => {
			if (code !== 0)
				reject(new Error(`Worker stopped with exit code ${code}`));
		})
	})
}

async function run(employer, employees) {
	logger.info(employer.NAME + ": Computing employees information...");
	//sleep(5000).catch(err=>{logger.debug(err)});
	const result = await employeesService({ employer, employees });
	employerSchema.setEmploeeReady(employer.id, true, 
			(err, result)=>{
				if(result)
					logger.debug(result);
				else
					logger.error(err.stack);
		});
	//return result;
}

/**
 * Check the data of the employer and then insert it to the database
 * if data is not valid then reject.
 * @param {} data 
 */
const getEmployeesOfEmployer = (empId) => {
	return new Promise(function (resolve, reject) {
		employeeSchema.getEmployeesOfEmployer(empId, (err, payload) => {
			if (err) {
				logger.error(err);
				reject(new ServerError(500, "internal error"))
			}
			let employeesList = [];
			for (i in payload) {
				employee = payload[i];
				employeesList[i] = employee.dataValues;
			}
			resolve(employeesList);
		});
	});
}

module.exports = { run, getEmployeesOfEmployer }