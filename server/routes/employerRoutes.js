const URL = require('url');
const express = require('express');
const passport = require('passport');
const passoptService = require('../services/passport');
const router = express.Router();
const authenticationService = require('../services/authentication');
const { ServerError, logger } = require("../log");
const excel = require("../db/excel");
const companyData = require("../services/companyData");
const loadData = require("../services/loadData");
const employeesData = require("../services/employeesData");
const { isInteger } = require("../tools");

/**
 * session: false means do not create session after authentication.
 * (Session are used for cookies but we use tokens)
 */
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


/* router.get("/", requireAuth, function (req, res) {
   res.send("success");
});
router.post("/signin/", function (req, res, next) {
   req.query = req.fields;
   next();
}, requireSignin, authenticationService.signin);

router.post("/signup/", authenticationService.singup);
 */
/*
   Read a xlsx file with 2 sheets. 
   Sheet number 1 is contains employer information.
   Sheet number 2 is holds employees information.
*/
router.post("/upload/", async (req, res, next) => {
   let url = URL.parse(req.url, true);
   let xlsxSheets;
   let result;
   xlsxSheets = await excel.post_file(req, res, url.query.f);
   if (xlsxSheets) {
      companyData.readSheet(xlsxSheets).then(data => {
         res.status(200).json(data);
      }).catch(error => {
         if (error.status)
            res.status(error.status).send(error.message);
         else {
            logger.error(error.stack);
            res.status(500).send("Internal Error");
         }
      });

   }
   else {
      logger.info("XLSX file is missing or invalid");
      res.status(400).send("קובץ Xlsx חסר או לא תקין");
   }
});

/*
  get companies data
*/
router.get("/", (req, res, next) => {
   loadData.getData().then((payload) => {
      res.status(200).json(payload)
   }).catch(error => {
      if (error.status)
         res.status(error.status).send(error.message);
      else {
         logger.error(error.stack);
         res.status(500).send("Internal Error");
      }
   });
});

/**
 * get all employees of specific employer
 */
router.get("/:employerId/employee", (req, res, next) => {
   let errorMessage = "employer id is missing or incorrect";
   let isError = false;
   if (req.params) {
      if ((req.params.employerId) && isInteger(req.params.employerId)) {
         empId = parseInt(req.params.employerId);
         employeesData.getEmployeesOfEmployer(empId).then((payload) => {
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
 * return the precent of employees finished to upload
 */
router.get("/:employerId/employee/precentReady", (req, res, next) => {
   let errorMessage = "employer id is missing or incorrect";
   let isError = false;
   if (req.params) {
      if ((req.params.employerId) && isInteger(req.params.employerId)) {
         empId = parseInt(req.params.employerId);
         employeesData.getPrecentFinished(empId).then((payload) => {
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