const { Column, TYPES } = require("./column");
const { isHebrewLetter } = require("../../tools");
const { ColumnError, ERROR_CODES } = require("./columnError");


class City extends Column {

    constructor(name, title) {
        super(name, title, TYPES.STRING, 45, false);

    }

    check = function (value) {
        let city;
        try {
            city = value.trim();
        }
        catch(error) {
            throw new ColumnError(ERROR_CODES.INPUT_ERROR, `הערך ${value} ב ${this.title} אינו תקין`);
        }
        if (!isHebrewLetter(value)) {
            throw new ColumnError(ERROR_CODES.INPUT_ERROR, `הערך ${value} ב ${this.title} אינו תקין`);
        }
        return city;
    }
}

module.exports = { City }