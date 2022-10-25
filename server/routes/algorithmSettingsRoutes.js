const express = require("express");
const passport = require("passport");
const router = express.Router();
const { logger } = require("../log");
const solutionMarksData = require("../services/data/solutionMarksData");
const solutionPropertiesValuesData = require("../services/data/solutionPropertiesValuesData");
const solutionLimitsData = require("../services/data/solutionLimitsData");

/**
 * session: false means do not create session after authentication.
 * (Session are used for cookies but we use tokens)
 */
const requireAuth = passport.authenticate("jwt", { session: false });

/*
  get solution marks data
*/
router.get("/solutionMarks", requireAuth, (req, res, next) => {
  solutionMarksData
    .getAllSolutionMarks()
    .then((payload) => {
      res.status(200).json(payload);
    })
    .catch((error) => {
      if (error.status) res.status(error.status).send(error.message);
      else {
        logger.error(error.stack);
        res.status(500).send("Internal Error");
      }
    });
});

/*
  update a solution mark
*/
router.post("/solutionMarks", requireAuth, (req, res, next) => {
  let errorMessage = null;
  if (req.body) {
    solutionMarksData
      .updateSolutionMark(req.body)
      .then((payload) => {
        res.status(200).json(payload);
      })
      .catch((error) => {
        if (error.status) res.status(error.status).send(error.message);
        else {
          logger.error(error.stack);
          res.status(500).send("Internal Error");
        }
      });
  } else errorMessage = "חסרים פרמטרים לעדכון הרשומה";

  if (errorMessage) {
    logger.info(errorMessage);
    res.status(400).send(errorMessage);
  }
});

/*
  get solution marks data
*/
router.get("/solutionPropertiesValues", requireAuth, (req, res, next) => {
  solutionPropertiesValuesData
    .getAllSolutionPropertiesValues()
    .then((payload) => {
      res.status(200).json(payload);
    })
    .catch((error) => {
      if (error.status) res.status(error.status).send(error.message);
      else {
        logger.error(error.stack);
        res.status(500).send("Internal Error");
      }
    });
});

/*
  update a solution property values
*/
router.post("/solutionPropertyValue", requireAuth, (req, res, next) => {
  let errorMessage = null;
  if (req.body) {
    solutionPropertiesValuesData
      .updateSolutionPropertyValue(req.body)
      .then((payload) => {
        res.status(200).json(payload);
      })
      .catch((error) => {
        if (error.status) res.status(error.status).send(error.message);
        else {
          logger.error(error.stack);
          res.status(500).send("Internal Error");
        }
      });
  } else errorMessage = "חסרים פרמטרים לעדכון הרשומה";

  if (errorMessage) {
    logger.info(errorMessage);
    res.status(400).send(errorMessage);
  }
});

/*
  get solution limits
*/
router.get("/solutionLimits", requireAuth, (req, res, next) => {
  solutionLimitsData
    .getAllSolutionLimits()
    .then((payload) => {
      res.status(200).json(payload);
    })
    .catch((error) => {
      if (error.status) res.status(error.status).send(error.message);
      else {
        logger.error(error.stack);
        res.status(500).send("Internal Error");
      }
    });
});

/*
  update a solution limit
*/
router.post("/solutionLimits", requireAuth, (req, res, next) => {
  let errorMessage = null;
  if (req.body) {
    solutionLimitsData
      .updateSolutionLimit(req.body)
      .then((payload) => {
        res.status(200).json(payload);
      })
      .catch((error) => {
        if (error.status) res.status(error.status).send(error.message);
        else {
          logger.error(error.stack);
          res.status(500).send("Internal Error");
        }
      });
  } else errorMessage = "חסרים פרמטרים לעדכון הרשומה";

  if (errorMessage) {
    logger.info(errorMessage);
    res.status(400).send(errorMessage);
  }
});

module.exports = router;
