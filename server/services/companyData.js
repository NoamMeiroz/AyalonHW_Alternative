const { ServerError, logger } = require('../log');
const employerSchema = require("../db/employerSchema");
const empFields = require("../config/config").employerFieldsName;
const siteData = require("./siteData");
const employeesData = require("./employeesData");
const employer = require('../models/employer');


/**
 * Check if sheet has all attributes
 * @param {*} obj 
 * @param {*} attrs 
 */
function defined_structure(obj, attrs) {
    if (!obj)
        return { valid: false, attribute: "רשימת עובדים" };
    var tmp = obj;
    for (i = 0; i < attrs.length; ++i) {
        if (tmp[attrs[i]] == undefined)
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
        BOOL = {
            "כן": 1,
            "לא": 0
        };
        result = defined_structure(data, [
            empFields.NAME,
            empFields.SECTOR,
            empFields.PRIVATE_CAR,
            empFields.SHUTTLE,
            empFields.MASS_TRANSPORTATION,
            empFields.CAR_POOL,
            empFields.WORK_FROM_HOME
        ]);
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
                // create valid employer entity
                currSector = sectorData.find(sector => sector.dataValues.SECTOR == data[empFields.SECTOR]);
                if (currSector == null) {
                    logger.info("incorrect sector");
                    return reject(new ServerError(400, "סקטור לא תקין או לא קיים במערכת."));
                }
                let employer = {
                    NAME: data[empFields.NAME],
                    SECTOR: currSector.dataValues.id,
                    PRIVATE_CAR_SOLUTION: BOOL[data[empFields.PRIVATE_CAR]],
                    SHUTTLE_SOLUTION: BOOL[data[empFields.SHUTTLE]],
                    MASS_TRANSPORTATION_SOLUTION: BOOL[data[empFields.MASS_TRANSPORTATION]],
                    CAR_POOL_SOLUTION: BOOL[data[empFields.CAR_POOL]],
                    WORK_FROM_HOME_SOLUTION: BOOL[data[empFields.WORK_FROM_HOME]],
                    EMPLOYER_ID: 0
                };
                return resolve(employer);
            });
        }
    });
}

const readSheet = (company_sheets) => {
    return new Promise(function (resolve, reject) {
        if (company_sheets == undefined) {
            return reject(new ServerError(status = 400, message = "קובץ אקסל לא תקין"));
        }
        if (company_sheets["פרטי חברה"] == null) {
            return reject(new ServerError(status = 400, message = "חוצץ פרטי חברה חסר"));
        }
        let employerData = company_sheets["פרטי חברה"][0];
        if (employerData == undefined) {
            return reject(new ServerError(status = 400, message = "פרטי החברה חסרים"));
        }

        let employees = company_sheets["פרטי עובדים"];
        if (employees == undefined)
            return reject(new ServerError(status = 400, message = "חוצץ פרטי עובדים חסר"));
        else if (employees[0] === undefined)
            return reject(new ServerError(status = 400, message = "חוצץ פרטי עובדים אינו מכיל מידע על העובדים"));

        result = defined_structure(employees[0], ["שם אתר", "מזהה עובד", "עיר מגורים", "רחוב", "מספר בניין", "כתובת עבודה-עיר", "כתובת עבודה-רחוב", "כתובת עבודה-מספר בניין"]);
        if (!result.valid) {
            return reject(new ServerError(status = 400, message = `פרטי עובדים לא כוללים  ${result.attribute}`));
        }
        // check and create valid employerObject and siteList
        Promise.all([handleEmployerData(employerData), siteData.handleSiteData(employees)])
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
                                    employeesData.run(employer, employees);
                                    resolve(employer);
                                }
                                catch (error) {
                                    logger.error(error);
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
                    logger.error(error.stack);
                    reject(new ServerError(500, error));
                }
            });

    });
}

module.exports = { readSheet };