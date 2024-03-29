const URL = require('url');
const formidableMiddleware = require('express-formidable');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { logger } = require("../log");
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

router.post("/upload/", requireAuth, formidableMiddleware(), async (req, res, next) => {
   let url = URL.parse(req.url, true);
   let xlsxSheets;

   let isError = false;
   let uid = -1;
   if (req.fields)  {
      if (req.fields.uid) {
         uid = req.fields.uid;
      }
      else {
         logger.info("uid is missing.");
         res.status(400).send("מזהה לקוח חסר.");
         return;
      }
   }
   else {
      logger.info("body is missing.");
      res.status(400).send("מזהה לקוח חסר.");
      return;
   }
   xlsxSheets = await excel.post_file(req, res, url.query.f);
   if (xlsxSheets) {
      companyData.readSheet(uid, xlsxSheets).then(data => {
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
router.get("/", requireAuth, (req, res, next) => {
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
router.get("/:employerId/employee", requireAuth, (req, res, next) => {
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
router.get("/:employerId/employee/precentReady", requireAuth, (req, res, next) => {
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

/**
 * delete and remove entire company
 */
router.delete("/:employerId", requireAuth, (req, res, next) => {
   let errorMessage = "employer id is missing or incorrect";
   let isError = false;
   if (req.params) {
      if ((req.params.employerId) && isInteger(req.params.employerId)) {
         empId = parseInt(req.params.employerId);
         companyData.deleteEmployer(empId).then((payload) => {
            res.status(200).json("success");
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
 * run the recalculation procedure to update best routes and marks
 */
router.put("/:employerId/recalculate", requireAuth, (req, res, next) => {
   let errorMessage = "employer id is missing or incorrect";
   let isError = false;
   let uid = -1;
   if (req.params) {
      if (req.body.uid) {
         uid = req.body.uid;
      }
      else {
         isError = true;
         errorMessage = "Websocket uid is missing";
      }
      if (!isError && (req.params.employerId) && isInteger(req.params.employerId)) {
         empId = parseInt(req.params.employerId);
         companyData.recalculateRoutes(uid, empId).then((payload) => {
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