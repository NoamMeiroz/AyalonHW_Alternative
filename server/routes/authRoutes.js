const express = require('express');
const passport = require('passport');
const passoptService = require('../services/passport');
const router = express.Router();
const authenticationService = require('../services/authentication');

/**
 * session: false means do not create session after authentication.
 * (Session are used for cookies but we use tokens)
 */
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


router.get("/", requireAuth, function (req, res) {
   res.send("success");
});
router.post("/signin/", function (req, res, next) {
   req.query = req.fields;
   next();
}, requireSignin, authenticationService.signin);

router.post("/signup/", authenticationService.singup);


module.exports = router;