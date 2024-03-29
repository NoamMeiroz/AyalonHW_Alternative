const jwt = require("jwt-simple");
const { v4: uuidv4 } = require('uuid');
const userSchema = require("../db/userSchema");
const {logger} = require("../log");

tokenForUser = (userId) => {
    const timestamp = new Date().getTime();
    return jwt.encode({sub:userId, iat: timestamp}, process.env.secret);
}

/**
 * Handle singup prcoess
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const singup = function(req, res, next) {  
   let user = req.body.userId;
   let password = req.body.password;
   if (!user || !password) {
       return res.status(401).send("userId or password are missing\n");
   }
   userSchema.insertUser(user, password, function(isValid, data) {
      let result = {}
      if (isValid) {
         result = {code: 200, message: {token: tokenForUser(user)}};
         return res.status(result.code).json(result.message);
        }
      else {
         result = {code: 422, message: data};
         logger.error(`insertUser failed for user: ${user}. \nError: ${data}`);
         return res.status(result.code).send(result.message.concat("\n"));
      }
   });
}

const signin = function(req, res) {
  // const id = uuidv4();

 //  req.session.userId = id;
   return res.status(200).send({ token: tokenForUser(req.user.userId)});
}

module.exports = {singup, signin}