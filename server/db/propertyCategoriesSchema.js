const db = require("./database");
const propertyCategories = db.propertyCategories;

const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
  propertyCategories
    .findAll({
      order: [
        ["PROPERTY_CODE", "ASC"],
        ["CATEGORY_CODE", "ASC"],
      ],
    })
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(getMessage(err), false);
    });
};

module.exports = { getAll };
