const { ColumnError } = require("./columnError");
const { ERROR_CODES } = require("./columnError");
const {isInteger} = require('../../tools');
 
const TYPES = { 
    STRING: 1,
    INT: 2
}

const MYSQL_INT_MAX_NUMBER = 4294967295;

class Column {
    /**
     * 
     * @param {string} name 
     * @param {string} title 
     * @param {TYPES} type 
     * @param {int} length
     * @param {boolean} isNullable 
     */
    constructor(name, title, type, length, isNullable=false) {
        this.name = name;
        this.title = title;
        this.type = type;
        this.length = length;
        this.isNullable = isNullable;
    }

    /**
     * Check for specific columns
     * @param {any} value 
     */
    check = (value) => {
        var result = value;
        switch (this.type) {
            case TYPES.STRING:
                // in case input is an object return the text representation string
                if (typeof value === 'object') {
                    if (value.text) {
                        result = value.text
                    }
                }
                else
                    // convert number values as string
                    result = "" + value;
                result = result.trim();
                break;
            default:
                break;
        }
        return result;
    };

    /**
     * Check if column type and value match
     * @param {TYPES} type 
     * @param {any} value 
     */
    checkType = (type, value) => {
        switch (type) {
            case TYPES.INT:
                if (!isInteger(value)) 
                    throw new ColumnError(ERROR_CODES.TYPE_ERROR, `הערך ${value} ב ${this.title} אינו מספר שלם`);
                break;
            default:
                break;
        }
    }

    /**
     * Check if value if equal or less then length
     * @param {int} length 
     * @param {TYPES} type 
     * @param {any} value 
     */
    checkLength = (length, type, value) => {
        switch (type) {
            case TYPES.INT:
                if (Math.abs(value)>((10**length)-1) || value >= MYSQL_INT_MAX_NUMBER )
                    throw new ColumnError(ERROR_CODES.TYPE_ERROR, `הערך ${value} ב ${this.title} חורג מהגודל המותר`);
                 
                break;
            case TYPES.STRING:
                if (this.length>length)
                    throw new ColumnError(ERROR_CODES.TYPE_ERROR, `הערך ${value} ב ${this.title} חורג מהגודל המותר`); 
                break;
            default:
                break;
        }
    }

    validityCheck(value) {
        // check if missing value
        if ((!this.isNullable) && ((value === undefined) || (value === null) || (value === NaN)))
            throw new ColumnError(ERROR_CODES.NULL_ERROR, `עמודה ${this.title} אינה מכילה ערך`);
        // if null value and it is allowed then stop checking
        if ((this.isNullable) && ((value === undefined) || (value === null)))
            return value;
        this.checkType(this.type, value);
        this.checkLength(this.length, this.type, value);
        return this.check(value);
    }
}

module.exports = { Column, TYPES }