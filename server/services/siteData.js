const { ServerError, logger } = require('../log');
const employerSitesSchema = require("../db/employerSitesSchema");
const siteFields = require("../config/config").sitesFieldsName;
 
/**
 * Check the data of the employer and then insert it to the database
 * if data is not valid then reject.
 * @param {} data 
 */
const handleSiteData = (employerId, data) => {
    return new Promise(function (resolve, reject) {
        // create a site object for each record
        let siteList = data.map( employee => {  
            site = {EMPLOYER_ID : employerId,
            NAME: employee[siteFields.NAME],
            ADDRESS_CITY: employee[siteFields.ADDRESS_CITY],
            ADDRESS_STREET: employee[siteFields.ADDRESS_STREET], 
            ADDRESS_BUILDING_NUMBER: employee[siteFields.ADDRESS_BUILDING_NUMBER],
            NUM_OF_EMPLOYEES: 0}
            return site;
        });

        // create a unique list of sites from all records
        // count number of emplyees in each unqiue site
        // save unique sites
        let uniqueSite = new Map();
        for (i in siteList){
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

        employerSitesSchema.insertSites(employerId, uniqueSite, (err, data) => {
            if (!err) {
                let siteList = data.map((site)=>{
                    return site.dataValues;
                });
                resolve(siteList);
            }
            else {
                logger.error(err);
                reject(new ServerError(500, data));
            }
        });
    });
}
module.exports = { handleSiteData };
