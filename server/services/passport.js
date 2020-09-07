const passport = require('passport');
const userSchema = require("../db/userSchema");
const { logger }  = require('../log');
const { ExtractJwt } = require('passport-jwt');
const jwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

// setup options for JWT strategy
const jwtOptions = {
    // this tells jwt where in the request object the payload exists.
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    // this tells what secret to use in order to decode the payload
    secretOrKey: process.env.secret
};

// setup options for local strategy (simple http user, password)
const localOptions = {
    usernameField: 'userId'  // this is the field to look asusernameField in the request body
};

// create JWT strategy
const jwtLogin = new jwtStrategy(jwtOptions, function(payload, done){
    // check if userId in the payload exists in db 
    // if yes, call done with userId else without userId
    userSchema.findById(payload.sub, function(err, user){
        if ( err ) {
            return done(err,false);
        }
        if ( user ) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
});

const localLogin = new LocalStrategy(localOptions, function(userId, password, done){
    // verify userId and password match a saved user and then send done.
    // else send done with false
    userSchema.findById(userId, function(err, user){
        logger.debug(user);
        if ( err ) {
            logger.error(err);
            return done(err,false);
        }
        if ( user && user.length>0 ) {
            logger.debug("before validPassowrd");
            user[0].validPassword(password, function(err, isMatch){
                logger.debug("in valid password callback");
                if ( err ) {
                    logger.error(err);
                    return done(err,false);
                }
                if (isMatch) {
                    logger.debug("successful password match");
                    return done(null, user[0]);
                }
                else {
                    logger.debug("worng password");
                    return done(null, false); 
                }

            });
            logger.debug("after valid pass");
        }
        else {
            logger.debug("wrong user")
            return done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
