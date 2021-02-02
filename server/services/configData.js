const { ServerError, logger } = require('../log');
const configSchema = require("../db/configSchema");

/**
 * get list of all localities
 * @param {} data 
 */
const getAllConfig = () => {
    return new Promise(function (resolve, reject) {
        configSchema.getAll((err, data)=> {
            if (err) {
                logger.error(err);
                return reject(new ServerError(500, err));
            }
            let configList = [];
            if (data)
                configList = data.map(config=>config.dataValues);
            resolve( configList );          
        });
    });
}

module.exports = { getAllConfig };