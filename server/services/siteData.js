const { ServerError, logger } = require('../log');
const employerSitesSchema = require("../db/employerSitesSchema");
const { employeeFieldsName } = require("../config/config");
const googleAPI = require('./googleAPI');
const { ERRORS } = require("./ERRORS");

const { Column, TYPES } = require('./columns/column');
const { City } = require('./columns/city');
const { Street } = require('./columns/street');
const { BuildingNumber } = require('./columns/buildingNumber');

const SITE_COLUMNS = [
    new Column("SITE_ID", "מספר סניף", TYPES.INT, 8, false),
    new Column("NAME", "שם סניף", TYPES.STRING, 50, false),
    new City("ADDRESS_CITY", "עיר"),
    new Street("ADDRESS_STREET", "רחוב"),
    new BuildingNumber("ADDRESS_BUILDING_NUMBER", "מספר"),
];


/**
 * Convert all sites address to X,Y coordinates.
 * If one address is invalid then reject all.
 * @param {*} branchList 
 */
const convertAddress = (branchList) => {
    return new Promise(function (resolve, reject) {

        // calculate coordination using google api
        let convertPromise = [];
        branchList.forEach((branch, index, array) => {
            convertPromise.push(googleAPI.convertLocation(branch.ADDRESS_CITY,
                branch.ADDRESS_STREET,
                branch.ADDRESS_BUILDING_NUMBER));
        });

        // wait to finish with all employees and then save
        Promise.all(convertPromise)
            .then(result => {
                result.forEach((value, index, array) => {
                    let error = null;
                    if (value instanceof ServerError) {
                        logger.info(value);
                        switch (value.status) {
                            case ERRORS.INVALID_ADDRESS_CODE:
                                error = new ServerError(400, `כתובת סניף ${branchList[index].NAME} לא תקינה.`);
                                break;
                            case ERRORS.MISSING_CITY_CODE:
                                error = new ServerError(400, `לסניף ${branchList[index].NAME} חסר עיר.`);
                                break;
                            case ERRORS.MISSING_STREET_CODE:
                                error = new ServerError(400, `לסניף ${branchList[index].NAME} חסר שם רחוב.`);
                                break;
                            case ERRORS.MISSING_BUILDING_NUMBER_CODE:
                                error = new ServerError(400, `לסניף ${branchList[index].NAME} חסר מספר בניין.`);
                                break;
                            case ERRORS.INVALID_CITY:
                                error = new ServerError(400, `לסניף ${branchList[index].NAME} שם העיר שגוי`);
                                break;
                            case ERRORS.INVALID_STREET:
                                error = new ServerError(400, `לסניף ${branchList[index].NAME} שם הרחוב שגוי`);
                                break;
                            case ERRORS.MISSING_CITY_CODE:
                                branchList[index].X = value.X;
                                branchList[index].Y = value.Y;
                                return  resolve(branchList);
                            case ERRORS.HELKA_NOT_FOUND:
                                branchList[index].X = value.X;
                                branchList[index].Y = value.Y;
                                return  resolve(branchList);
                            case 500:
                                error = value;
                                break;
                            default:
                                error = new ServerError(500, "שגיאה לא ידועה");
                                break;
                        }
                        return reject(error);
                    }
                    else {
                        branchList[index].X = value.X;
                        branchList[index].Y = value.Y;
                        branchList[index].ADDRESS_CITY = value.CITY;
                    }
                })
                resolve(branchList);
            })
            .catch(error => {
                logger.error(error.stack);
                reject = new ServerError(500, error);
            });
    });
}

/**
 * save list of sites for a given employer
 */
saveSites = (employerId, siteList) => {
    return new Promise(function (resolve, reject) {
        siteList.forEach((site, index, array) => {
            site.EMPLOYER_ID = employerId;
        });
        employerSitesSchema.insertSites(employerId, siteList, (err, data) => {
            if (!err) {
                let siteList = data.map((site) => {
                    return site.dataValues;
                });
                resolve(siteList);
            }
            else {
                reject(new ServerError(500, err));
            }
        });
    });
}


/**
 * Check the data of the employer and then return valid siteList
 * if data is not valid then reject.
 * @param {} data 
 */
const handleBranchData = (branches, emploeesList) => {
    return new Promise(function (resolve, reject) {
        // create a site object for each record
        let uniqueBranch = new Map();
        for (branchItem of branches) {
            let branch = {
                NUM_OF_EMPLOYEES: 0
            }
            // check sites data
            for (const column of SITE_COLUMNS) {
                try {
                    branch[column.name] = column.validityCheck(branchItem[column.title]);
                }
                catch (err) {
                    return reject(new ServerError(400,`סניפים-${err.message}`));
                }
            }
            uniqueBranch.set(branch.SITE_ID, branch);
        }
        // count number of emplyees in each unqiue site
        for (const [index, employee] of emploeesList.entries()) {
            if (!uniqueBranch.has(employee[employeeFieldsName.BRANCH_ID])) {
                let employeeID = `בשורה ${index + 2}`;
                if (employee[employeeFieldsName.WORKER_ID])
                    employeeId = employee[employeeFieldsName.WORKER_ID];
                return reject(new ServerError(400, `מספר סניף של עובד  ${employeeID} שגוי או סניף לא קיים`));
            }
            let branch = uniqueBranch.get(employee[employeeFieldsName.BRANCH_ID]);
            branch.NUM_OF_EMPLOYEES = branch.NUM_OF_EMPLOYEES + 1;
            uniqueBranch.set(branch.SITE_ID, branch);
        }

        uniqueBranch = Array.from(uniqueBranch.values());
        // convert address of each branch to X, Y and find the correct city name.
        convertAddress(uniqueBranch)
            .then(branchList => {
                resolve(branchList);
            })
            .catch(error => {
                reject(error);
            });
    });
}
module.exports = { handleBranchData, saveSites };
