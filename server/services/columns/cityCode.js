const { Column, TYPES } = require("./column");
const { isHebrewLetter } = require("../../tools");
const { ColumnError, ERROR_CODES } = require("./columnError");

class CityCode extends Column {
  constructor(name, title, locality) {
    super(name, title, TYPES.STRING, 45, false);
    this.locality = locality;
  }

  /**
   * Return name of city by code
   * @param {*} timeSlot
   */
  getLocalityByCode = (code) => {
    let currentLocality = this.locality.filter(
      (locality) => locality.CODE === code
    );
    if (currentLocality.length > 0) return currentLocality[0].NAME;
    else null;
  };

  check = function (value) {
    let city;
    try {
      if (value) city = this.getLocalityByCode(value);
      if (!city)
        throw new ColumnError(
          ERROR_CODES.INPUT_ERROR,
          `הערך ${value} ב ${this.title} אינו תקין`
        );
    } catch (error) {
      throw new ColumnError(
        ERROR_CODES.INPUT_ERROR,
        `הערך ${value} ב ${this.title} אינו תקין`
      );
    }
    return city;
  };
}

module.exports = { CityCode };
