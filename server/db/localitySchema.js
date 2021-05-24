const db = require("./database");
const Locality = db.locality;
const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
  // Save Tutorial in the database
  Locality.findAll({
    order: [
      ['NAME', 'ASC']
    ]
  }).then(data => { callback(null, data) })
    .catch(err => { callback(getMessage(err), false); });
};

const findByCode = (code, callback) => {
  // Save Tutorial in the database
  Locality.findOne({
    where: {
      code: code
    }
  }).then(data => { callback(null, data) })
    .catch(err => { callback(getMessage(err), false); });
};

/**
 * Find locality (settelment) name by searching the municipal in a given X,Y (EPSG 2039)
 * If cv_pnim code is null then use cr_pnim code.
 * @param {*} x 
 * @param {*} y 
 * @param {*} callback 
 */
const findLocality = (city, x, y, callback) => {
  Locality.findOne({
    where: {
      name: city
    }
  }).then(async data => {
    if (data) {
      callback(null, data);
    }
    else {
      try {
        const code = await db.sequelize.query(`SELECT name  FROM alternative.muni_vaadim, locality where 
          ( cv_pnim = code OR cr_pnim = code ) AND st_contains(SHAPE, ST_GeomFromText('POINT(${x} ${y})',2039))`, { type: db.Sequelize.QueryTypes.SELECT });
        callback(null, code);
      }
      catch (errr) {
        callback(getMessage(err), false);
      }
    }

  }).catch(err => { callback(getMessage(err), false); });
}

module.exports = { findByCode, getAll, findLocality };