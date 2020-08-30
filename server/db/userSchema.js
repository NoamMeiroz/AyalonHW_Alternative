const db = require("./database");
const User = db.user;
const getMessage = require("./errorCode").getMessage;

const insertUser = (userId, password, callback) => {
  
    // Create a Tutorial
    const user = {
      userId: userId,
      password: password
    };
  
    // Save Tutorial in the database
    User.create(user)
      .then(data=>{callback(true, data)})
      .catch(err=>{ callback(false, getMessage(err));});
  };

const findById = (userId, callback) => {
    // Save Tutorial in the database
    User.findAll({
      where: {
        userId: userId
      }
    }).then(data=>{callback(null, data)})
      .catch(err=>{callback(getMessage(err), false);});
  };

module.exports = { insertUser, findById};