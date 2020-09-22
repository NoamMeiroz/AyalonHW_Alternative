const { ServerError, logger } = require('../log');
const employerSitesSchema = require("../db/employerSitesSchema");
const siteFields = require("../config/config").sitesFieldsName;
const googleAPI = require('./googleAPI');

/**
 * Convert all sites address to X,Y coordinates.
 * If one address is invalid then reject all.
 * @param {*} siteList 
 */
const convertAddress = (siteList) => {
    return new Promise(function (resolve, reject) {

        // calculate coordination using google api
        let convertPromise = [];
        siteList.forEach((site, index, array) => {
            convertPromise.push(googleAPI.convertLocation(site.ADDRESS_CITY,
                site.ADDRESS_STREET,
                site.ADDRESS_BUILDING_NUMBER));
        });

        // wait to finish with all employees and then save
        Promise.all(convertPromise)
            .then(result => {
                result.forEach((value, index, array) => {
                    let error = null;
                    if (value instanceof ServerError) {
                        switch (value.status) {
                            case googleAPI.ERRORS.INVALID_ADDRESS_CODE:
                                error = new ServerError(400, `כתובת אתר ${siteList[index].NAME} לא חוקית.`);
                                break;
                            case googleAPI.ERRORS.MISSING_CITY_CODE:
                                error = new ServerError(400, `לאתר ${siteList[index].NAME} חסר עיר מגורים.`);
                                break;
                            case googleAPI.ERRORS.MISSING_STREET_CODE:
                                error = new ServerError(400, `לאתר ${siteList[index].NAME} חסר שם רחוב.`);
                                break;
                            case googleAPI.ERRORS.MISSING_BUILDING_NUMBER_CODE:
                                error = new ServerError(400, `לאתר ${siteList[index].NAME} חסר מספר בניין.`);
                                break;
                            default:
                                error = new ServerError(500, "שגיאה לא ידועה");
                                break;
                        }
                        return reject(error);
                    }
                    else {
                        siteList[index].X = value.X;
                        siteList[index].Y = value.Y;
                    }
                })
                resolve(siteList);
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
const handleSiteData = (data) => {
    return new Promise(function (resolve, reject) {
        // create a site object for each record
        let siteList = data.map(employee => {
            site = {
                NAME: employee[siteFields.NAME],
                ADDRESS_CITY: employee[siteFields.ADDRESS_CITY],
                ADDRESS_STREET: employee[siteFields.ADDRESS_STREET],
                ADDRESS_BUILDING_NUMBER: employee[siteFields.ADDRESS_BUILDING_NUMBER],
                NUM_OF_EMPLOYEES: 0
            }
            return site;
        });

        // create a unique list of sites from all records
        // count number of emplyees in each unqiue site
        // save unique sites
        let uniqueSite = new Map();
        for (i in siteList) {
            let site = undefined;
            if (!uniqueSite.has(siteList[i].NAME)) {
                siteList[i].SITE_ID = i;
                siteList[i].NUM_OF_EMPLOYEES = 1;
                site = siteList[i];
            }
            else {
                let site = uniqueSite.get(siteList[i].NAME);
                site.NUM_OF_EMPLOYEES = site.NUM_OF_EMPLOYEES + 1;
            }
            if (site)
                uniqueSite.set(site.NAME, site);
        }
        uniqueSite = Array.from(uniqueSite.values());

        convertAddress(uniqueSite)
            .then(siteList => {
                resolve(siteList);
            })
            .catch(error => {
                reject(error);
            });
    });
}
module.exports = { handleSiteData, saveSites };
