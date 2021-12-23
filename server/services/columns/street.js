const { Column, TYPES } = require("./column");
const { isHebrewLetter, removeLastWordWithDigits } = require("../../tools");
const { ColumnError, ERROR_CODES } = require("./columnError");


class Street extends Column {

    constructor(name, title) {
        super(name, title, TYPES.STRING, 45, false);

    }

    check = function (value) {
        let street;
        try {
            street = value.trim();
            if (street.length===0)
                throw new ColumnError(ERROR_CODES.NULL_ERROR, `עמודה ${this.title} אינה מכילה ערך`);
        }
        catch(error) {
            throw new ColumnError(ERROR_CODES.INPUT_ERROR, `הערך ${value} ב ${this.title} אינו תקין`);
        }
        street = removeLastWordWithDigits(street).trim();

        if (!isHebrewLetter(street)) {
            throw new ColumnError(ERROR_CODES.INPUT_ERROR, `הערך ${value} ב ${this.title} אינו תקין`);
        }

        return street;
    }
}

module.exports = { Street }