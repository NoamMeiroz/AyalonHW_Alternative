const { Column, TYPES } = require("./column");
const { ColumnError, ERROR_CODES } = require("./columnError");

class Sector extends Column {

    constructor(name, title, sectorList) {
        super(name, title, TYPES.STRING, 45, false);
        this.sectorList = sectorList;
    }

    check = function (value) {
        // convert sector to id
        let currSector = this.sectorList.find(sector => sector.dataValues.SECTOR == value);
        if (currSector === null || currSector === undefined) {
            throw new ColumnError(ERROR_CODES.INPUT_ERROR, `הערך ${value} ב ${this.title} אינו תקין`);
        }
        return currSector.dataValues.id;
    }
}

module.exports = { Sector }