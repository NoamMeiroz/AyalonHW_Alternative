const { ServerError, logger } = require('../../log');
const streetsSchema = require("../../db/streetsSchema");
const { ERRORS } = require("../ERRORS");

/**
 * get list of all localities
 * @param {} data 
 */
const getAllStreets = () => {
    return new Promise(function (resolve, reject) {
        streetsSchema.getAll((err, data) => {
            if (err) {
                logger.error(err);
                return reject(new ServerError(500, err));
            }
            let streetsList = [];
            if (data)
            streetsList = data.map(street => street.dataValues);
            resolve(streetsList);
        });
    });
}

module.exports = { getAllStreets };