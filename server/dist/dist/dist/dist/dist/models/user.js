"use strict";

const crypto = require("crypto");

const SEPORATOR = ".";
const LENGTH = 64;

module.exports = (sequelize, Sequelize) => {
  var User = sequelize.define("user", {
    userId: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(1000),
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: function (user) {
        try {
          let salt = crypto.randomBytes(16).toString("hex");
          derivedKey = crypto.scryptSync(user.password, salt, LENGTH);
          user.password = salt + SEPORATOR + derivedKey.toString('hex');
        } catch (err) {
          console.log(err);
        }
      }
    }
  });

  User.prototype.validPassword = function (password, callback) {
    const [salt, key] = this.password.split(SEPORATOR);
    crypto.scrypt(password, salt, LENGTH, (err, derivedKey) => {
      if (err) {
        callback(err, false);
      }

      if (key == derivedKey.toString('hex')) callback(null, true);else callback(null, false);
    });
  };

  return User;
};