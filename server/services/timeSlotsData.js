const { ServerError, logger } = require('../log');
const timeSlotsSchema = require("../db/timeSlotsSchema");

/**
 * get list of all timeSlots
 * @param {} data 
 */
const getTimeSlots = async () => {
    return new Promise(function (resolve, reject) {
        timeSlotsSchema.getAll((err, data) => {
            if (err) {
                logger.error(err);
                return reject(new ServerError(500, err));
            }
            let timeSlotsList = [];
            if (data)
                timeSlotsList = data.map(timeSlot => timeSlot.dataValues);
            return resolve(timeSlotsList);
        });
    });
}

/**
 * get list of time slots available to exit for work
 * @param {} data 
 */
const getExitToWorkTimeSlots = () => {
    return new Promise(function (resolve, reject) {
        timeSlotsSchema.getExitToWork((err, data) => {
            if (err) {
                logger.error(err);
                return reject(new ServerError(500, err));
            }
            let timeSlotsList = [];
            if (data)
                timeSlotsList = data.map(timeSlot => timeSlot.dataValues);
            return resolve(timeSlotsList);
        });
    });
}

/**
 * get list of time slots available to return for home
 * @param {} data 
 */
const getReturnToHomeTimeSlots = () => {
    return new Promise(function (resolve, reject) {
        timeSlotsSchema.getReturnHome((err, data) => {
            if (err) {
                logger.error(err);
                return reject(new ServerError(500, err));
            }
            let timeSlotsList = [];
            if (data)
                timeSlotsList = data.map(timeSlot => timeSlot.dataValues);
            return resolve(timeSlotsList);
        });
    });
}

module.exports = { getTimeSlots, getExitToWorkTimeSlots, getReturnToHomeTimeSlots };