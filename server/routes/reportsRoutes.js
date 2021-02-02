const URL = require('url');
const express = require('express');
const passport = require('passport');
const router = express.Router();

const { logger } = require("../log");
const { isInteger } = require("../tools");
const reports = require("../services/reports");

/**
 * session: false means do not create session after authentication.
 * (Session are used for cookies but we use tokens)
 */
const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * return number of employees in each living city that works in the same city of the given employer
 */
router.get("/share_potential/employer/:employerId", requireAuth, (req, res, next) => {
    let errorMessage = "employer id is missing or incorrect";
    let isError = false;
    if (req.params) {
        if ((req.params.employerId) && isInteger(req.params.employerId)) {
            empId = parseInt(req.params.employerId);
            reports.getSharePotential(empId).then((payload) => {
                res.status(200).json(payload);
            }).catch(error => {
                if (error.status)
                    res.status(error.status).send(error.message);
                else {
                    logger.error(error.stack);
                    res.status(500).send("Internal Error");
                }
            });
        }
        else
            isError = true;
    }
    else
        isError = true;

    if (isError) {
        logger.info(errorMessage);
        res.status(400).send(errorMessage);
    }

});

/**
 * get all employees of specific employer
 */
router.post("/employee", requireAuth, (req, res, next) => {
    let errorMessage = "employer id is missing or incorrect";
    let isError = false;
    if (req.body) {
        companies = req.body.companies; //convertStringToArray(req.body.companies);
        if (companies) {
            try {
                companies = companies.map((value, index, arr) => {
                    return parseInt(value);
                });
            }
            catch (err) {
                logger.error(err.stack);
                isError = true;
                companies = null;
            }
        }
        if (!isError) {
            let livingCity = req.body.livingCity;
            let workingCity = req.body.workingCity;
            let timeSlotWork =req.body.timeSlotWork;
            let timeSlotHome = req.body.timeSlotHome;
            let destinationPolygon = req.body.destinationPolygon;
            let startingPolygon = req.body.startingPolygon;

            let marks = req.body.marks;
            reports.getEmployeesOfEmployer(companies, livingCity, workingCity, 
                timeSlotWork, timeSlotHome, marks, 
                destinationPolygon, startingPolygon).then((payload) => {
                res.status(200).json(payload);
            }).catch(error => {
                if (error.status)
                    res.status(error.status).send(error.message);
                else {
                    logger.error(error.stack);
                    res.status(500).send("Internal Error");
                }
            });
        }
        else
            isError = true;
    }
    else
        isError = true;

    if (isError) {
        logger.info(errorMessage);
        res.status(400).send(errorMessage);
    }

});

module.exports = router;