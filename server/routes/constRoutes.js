const express = require('express');
const passport = require('passport');
const router = express.Router();
const { logger } = require("../log");
const localityData = require("../services/data/localityData");
const timeSlotsData = require("../services/data/timeSlotsData");
const siteData = require("../services/data/siteData");


/**
 * session: false means do not create session after authentication.
 * (Session are used for cookies but we use tokens)
 */
const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * return exit to work time slots
 */
router.get("/exitToWorkTimeSlots", requireAuth, (req, res, next) => {
    timeSlotsData.getExitToWorkTimeSlots()
        .then(payload => {
            res.status(200).json(payload);
        })
        .catch(error => {
            if (error.status)
                res.status(error.status).send(error.message);
            else {
                logger.error(error.stack);
                res.status(500).send("Internal Error");
            }
        });
});

/**
 * return return to home time slots
 */
router.get("/returnToHomeTimeSlots", requireAuth, (req, res, next) => {
    timeSlotsData.getReturnToHomeTimeSlots()
        .then(payload => {
            res.status(200).json(payload);
        })
        .catch(error => {
            if (error.status)
                res.status(error.status).send(error.message);
            else {
                logger.error(error.stack);
                res.status(500).send("Internal Error");
            }
        });
});

/**
 * return list of all localities
 */
router.get("/locality", requireAuth, (req, res, next) => {
    localityData.getAllLocality()
        .then(payload => {
            res.status(200).json(payload);
        })
        .catch(error => {
            if (error.status)
                res.status(error.status).send(error.message);
            else {
                logger.error(error.stack);
                res.status(500).send("Internal Error");
            }
        });
});

/**
 * return list of distinct compounds
 */
router.get("/compounds", requireAuth, (req, res, next) => {
    siteData.getUniqueCompounds()
        .then(payload => {
            res.status(200).json(payload);
        })
        .catch(error => {
            if (error.status)
                res.status(error.status).send(error.message);
            else {
                logger.error(error.stack);
                res.status(500).send("Internal Error");
            }
        });
});

module.exports = router;