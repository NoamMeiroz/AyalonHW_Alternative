const { Column, TYPES } = require("./column");
const { ColumnError, ERROR_CODES } = require("./columnError");

class StreetCode extends Column {
  constructor(name, title, streets) {
    super(name, title, TYPES.INT, 5, false);
    this.streets = streets;
    this.locality = locality
  }

  /**
   * Return name of city by code
   * @param {*} timeSlot
   */
  getStreet = (locality, streetCode) => {
    let currentStreet = this.streets.filter(
      (street) => street.LOCALITY === locality && street.STREET_CODE === streetCode
    );
    if (currentStreet.length > 0) return currentStreet[0].NAME;
    else null;
  };

  check = function (value) {
    let street;
    try {
      if (value) street = this.getStreet(this.locality, value);
      if (!street)
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
    return street;
  };
}

module.exports = { StreetCode };
