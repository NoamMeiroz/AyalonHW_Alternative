const { ServerError, logger } = require('../log');
const localitySchema = require("../db/localitySchema");

/**
 * get list of all localities
 * @param {} data 
 */
const getAllLocality = () => {
    return new Promise(function (resolve, reject) {
        localitySchema.getAll((err, data)=> {
            if (err) {
                logger.error(err);
                return reject(new ServerError(500, err));
            }
            let localityList = [];
            if (data)
                localityList = data.map(locality=>locality.dataValues);
            resolve( localityList );          
        });
    });
}

/**
 * get list of all localities
 * @param {} data 
 */
const getLocality = (code) => {
    return new Promise(function (resolve, reject) {
        localitySchema.findByCode(code, (err, data)=> {
            if (err) {
                logger.error(err);
                return reject(new ServerError(500, err));
            }
            if (data)
                locality = data.dataValues;
            resolve( locality );          
        });
    });
}

module.exports = { getAllLocality, getLocality };