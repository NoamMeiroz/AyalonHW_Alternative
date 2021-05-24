const { ServerError, logger } = require('../log');
const localitySchema = require("../db/localitySchema");
const { ERRORS } = require("./ERRORS");

/**
 * get list of all localities
 * @param {} data 
 */
const getAllLocality = () => {
    return new Promise(function (resolve, reject) {
        localitySchema.getAll((err, data) => {
            if (err) {
                logger.error(err);
                return reject(new ServerError(500, err));
            }
            let localityList = [];
            if (data)
                localityList = data.map(locality => locality.dataValues);
            resolve(localityList);
        });
    });
}

/**
 * get list of all localities
 * @param {} data 
 */
const getLocality = (code) => {
    return new Promise(function (resolve, reject) {
        localitySchema.findByCode(code, (err, data) => {
            if (err) {
                logger.error(`Could not find locality ${code}`);
                logger.error(err);
                return resolve(new ServerError(ERRORS.MISSING_CITY_CODE, err));
            }
            if (data) {
                let locality = data.dataValues;
                resolve(locality);
            }
            else {
                return resolve(new ServerError(ERRORS.CITY_CODE_NOT_FOUND, err));
            }
        });
    });
}


/**
 * get list of all localities
 * @param {} data 
 */
const getXYLocality = (city, x, y) => {
    return new Promise(function (resolve, reject) {
        localitySchema.findLocality(city, x, y, (err, data) => {
            if (err) {
                logger.error(`Could not find locality ${x}, ${y}`);
                logger.error(err);
                return resolve(new ServerError(ERRORS.INVALID_CITY, err));
            }
            if (data)
            {
                // if result is an array then value is in format [{name:"value"}]
                if (Array.isArray(data)) {
                    if (data.length===0)
                        return resolve(new ServerError(ERRORS.CITY_CODE_NOT_FOUND, err));
                    else
                        return resolve(data[0].name);  
                }
                // result is in dataValues
                else {
                    let locality = data.dataValues;
                    return resolve(locality.NAME);

                }
            }
            else
                return resolve(new ServerError(ERRORS.INVALID_CITY, `${x}, ${y} locality is missing`));
        });
    });
}
module.exports = { getAllLocality, getLocality, getXYLocality };