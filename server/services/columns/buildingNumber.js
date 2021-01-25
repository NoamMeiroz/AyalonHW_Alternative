const { Column, TYPES } = require("./column");
const { getFirstNumberInString } = require("../../tools");

class BuildingNumber extends Column {

    constructor(name, title) {
        super(name, title, TYPES.INT, 4, true);
    }

    validityCheck (value) {
        let buildNum = getFirstNumberInString(value) || 0;
        let result = ((buildNum) => {
            return super.validityCheck(buildNum);  
        })(buildNum);
        return result;
    }
}

module.exports = { BuildingNumber }