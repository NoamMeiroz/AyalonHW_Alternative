const { Column, TYPES } = require("./column");
const { ColumnError, ERROR_CODES } = require("./columnError");


class YesNoColumn extends Column {

    constructor(name, title) {
        super(name, title, TYPES.STRING, 2, false);

    }

    BOOL = {
        "כן": 1,
        "לא": 0
    };

    check = function (value) {
        let yesNo = value.trim();
        try{
            yesNo = this.BOOL[yesNo];
            if (yesNo === undefined )
                throw new ColumnError(ERROR_CODES.INPUT_ERROR, `הערך ${value} ב ${this.title} אינו תקין`);
        }
        catch(error){
            throw new ColumnError(ERROR_CODES.INPUT_ERROR, `הערך ${value} ב ${this.title} אינו תקין`);
        }
        return yesNo;
    }
}

module.exports = { YesNoColumn }