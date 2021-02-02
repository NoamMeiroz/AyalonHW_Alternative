const { ServerError, logger } = require('../log');
const employerSchema = require("../db/employerSchema");

/**
 * Check the data of the employer and then insert it to the database
 * if data is not valid then reject.
 * @param {} data 
 */
const getData = (callback) => {
    return new Promise(function (resolve, reject) {
        employerSchema.getAllSectors((err, sectorData)=> {
            if (err) {
                logger.error(sectorData);
                reject(new ServerError(500, sectorData));
            }
            let sectorList = {};
            for ( i in sectorData ) {
                sector = sectorData[i];
                sectorList[sector.dataValues.id]=sector.dataValues.SECTOR;
            }
            // create companies list
            employerSchema.getAllComapnies((err, comapniesData)=> {
                if (err) {
                    logger.error(err);
                    reject(new ServerError(500, comapniesData));
                }
                let companyList = {};
                if (comapniesData.companies)
                    companyList = comapniesData.companies.map(company=>{
                        let result = company.dataValues;
                        countResult = comapniesData.countValidEmployees.filter(row=>row.EMPLOYER_ID===result.id);
                        if (countResult.length>0)
                            result.countValidEmployees = countResult[0].validCount;
                        else    
                            result.countValidEmployees = 0;
                        return result;
                    });
                resolve({"sectors": sectorList, "companies": companyList});          
            });
        });
    });
}


module.exports = { getData };