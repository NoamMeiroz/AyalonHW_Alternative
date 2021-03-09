const { ServerError, logger } = require('../log');
const employerSchema = require("../db/employerSchema");
const empFields = require("../config/config").employerFieldsName;
const siteData = require("./siteData");
const employeesData = require("./employeesData");
const { branchesFieldsName, employeeFieldsName } = require('../config/config');

const { Column, TYPES } = require('./columns/column');
const { YesNoColumn } = require('./columns/yesno');
const { Sector } = require('./columns/sector');

const EMP_COLUMNS = [
        new Column("NAME", "שם חברה",TYPES.STRING, 50, false),
        new Column("NUMBER_OF_EMPLOYEES", "מספר עובדים",TYPES.INT, 8, false),
        new Column("NUMBER_OF_SITES", "מספר סניפים",TYPES.INT, 3, false),
        new YesNoColumn("PRIVATE_CAR_SOLUTION","רכב צמוד"),
        new YesNoColumn("MASS_TRANSPORTATION_SOLUTION","שירות הסעות"),
        new YesNoColumn("CAR_POOL_SOLUTION","Carpool"),
        new YesNoColumn("WORK_FROM_HOME_SOLUTION","עבודה מהבית")
];

/**
 * Check if sheet has all attributes
 * @param {*} obj 
 * @param {*} attrs 
 */
function defined_structure(obj, attrs) {
    if (!obj)
        return { valid: false, attribute: "נתונים" };
    var tmp = obj;
    for (i = 0; i < attrs.length; ++i) {
        if (!tmp.hasOwnProperty(attrs[i]))
            return { valid: false, attribute: attrs[i] };
    }
    return { valid: true };
}

/**
 * save employer object in the db
 */
saveEmployer = (employer) => {
    return new Promise(function (resolve, reject) {
        employerSchema.insertEmployer(employer, (err, data) => {
            if (!err)
                return resolve(data.dataValues);
            else {
                return reject(new ServerError(500, data));
            }
        });
    });
}

/**
 * Check the data of the employer and then return valid employer object;
 * if data is not valid then reject.
 * @param {} data 
 */
const handleEmployerData = (data) => {
    return new Promise(function (resolve, reject) {
        result = defined_structure(data, Object.values(empFields));
        if (!result.valid) {
            return reject(new ServerError(status = 400,
                message = `פרטי החברה לא כוללים נתוני ${result.attribute}`));
        }
        else {
            // get sectorlist
            employerSchema.getAllSectors((err, sectorData) => {
                if (err) {
                    logger.error(err.stack);
                    return reject(new ServerError(500, err));
                }
               
                let employer = {
                    EMPLOYER_ID: 0
                };
                // check employer data
                let allColumns = EMP_COLUMNS.concat([new Sector("SECTOR", "מגזר", sectorData)])
                for (const column of allColumns) {
                    try {
                        employer[column.name] = column.validityCheck(data[column.title]);
                    }
                    catch (err) {
                        return reject(new ServerError(400, err.message));
                    }
                 }
                return resolve(employer);
            });
        }
    });
}

const readSheet = (req, company_sheets) => {
    return new Promise(function (resolve, reject) {
        if (company_sheets == undefined) {
            return reject(new ServerError(status = 400, message = "קובץ אקסל לא תקין"));
        }
        if (company_sheets["מעסיקים"] == null) {
            return reject(new ServerError(status = 400, message = "חוצץ פרטי חברה חסר"));
        }
        let employerData = company_sheets["מעסיקים"][0];
        if (employerData == undefined) {
            return reject(new ServerError(status = 400, message = "פרטי החברה חסרים"));
        }

        let branches = company_sheets["סניפים"];
        if (branches == undefined)
            return reject(new ServerError(status = 400, message = "חוצץ פרטי סניפים חסר"));
        else if (branches[0] === undefined)
            return reject(new ServerError(status = 400, message = "חוצץ פרטי סניפים אינו מכיל מידע על הסניפים"));

        let employees = company_sheets["עובדים"];
        if (employees == undefined)
            return reject(new ServerError(status = 400, message = "חוצץ פרטי עובדים חסר"));
        else if (employees[0] === undefined)
            return reject(new ServerError(status = 400, message = "חוצץ פרטי עובדים אינו מכיל מידע על העובדים"));

        // check if sites fields exists
        fields = Object.values(branchesFieldsName);
        result = defined_structure(branches[0], fields);
        if (!result.valid) {
            return reject(new ServerError(status = 400, message = `פרטי סניפים לא כוללים  ${result.attribute}`));
        }

        // check if employees fields exists
        fields = Object.values(employeeFieldsName);
        result = defined_structure(employees[0], fields);
        if (!result.valid) {
            return reject(new ServerError(status = 400, message = `פרטי עובדים לא כוללים  ${result.attribute}`));
        }
        // check and create valid employerObject and siteList
        Promise.all([handleEmployerData(employerData), siteData.handleBranchData(branches, employees)])
            .then(result => {
                let employer = result[0];
                let siteList = result[1];
                // save employer
                saveEmployer(employer)
                    .then(data => {
                        let employer = data;
                        // if employer is succeccfully saved the save siteList
                        siteData.saveSites(employer.id, siteList)
                            .then(data => {
                                employer.Sites = data;
                                try {
                                    // handle employees
                                    employeesData.run(req, employer, employees);
                                    resolve(employer);
                                }
                                catch (error) {
                                    logger.error(error.stack);
                                    return reject(new ServerError(500, error));
                                }
                            })
                            .catch((error) => {
                                if (error instanceof ServerError) {
                                    logger.info(error.stack);
                                    reject(error);
                                }
                                else {
                                    logger.error(error.stack);
                                    reject(new ServerError(500, error));
                                }
                            });
                    })
                    .catch((error) => {
                        if (error instanceof ServerError) {
                            logger.info(error.stack);
                            reject(error);
                        }
                        else {
                            logger.error(error.stack);
                            reject(new ServerError(500, error));
                        }
                    });
            })
            .catch((error) => {
                if (error instanceof ServerError) {
                    logger.info(error.stack);
                    reject(error);
                }
                else {
                    logger.error(error);
                    reject(new ServerError(500, error));
                }
            });

    });
}

/**
 * Delete and reomove entire company data
 * @param {*} employer 
 */
const deleteEmployer = (empID) => {
	return new Promise(function (resolve, reject) {
		employerSchema.deleteEmployer(empID, (err, payload) => {
			if (err) {
				logger.error(err.stack);
				reject(new ServerError(500, err))
			}
			resolve({});
		});
	});
}


module.exports = { readSheet, deleteEmployer };