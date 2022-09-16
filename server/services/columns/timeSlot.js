const { Column, TYPES } = require("./column");
const { ColumnError, ERROR_CODES } = require("./columnError");

class TimeSlot extends Column {

    constructor(name, title, timeSlots, propertiesCategories, category, defaultValue) {
        super(name, title, TYPES.STRING, 45, true);
        this.timeSlots = timeSlots;
        this.defaultValue = defaultValue;
        this.propertiesCategories = propertiesCategories;
        this.category = category;
    }


    /**
     * Return id of timeslot description
     * @param {*} timeSlot 
     */
    getTimeSlotID = (timeSlot) => {
        let currentSlot = this.timeSlots.filter(slot => slot.TIME_SLOT === timeSlot);
        if (currentSlot.length > 0)
            return currentSlot[0].id;
        else
            null;
    }

    validityCheck(value) {
        // check if missing value
        if ((!this.isNullable) && ((value === undefined)   || (value === null)))
            throw new ColumnError(ERROR_CODES.NULL_ERROR, `עמודה ${this.title} אינה מכילה ערך`);
        // if null value and it is allowed then stop checking
        if ((this.isNullable) && ((value === undefined) || (value === null) || (value === 0) ))
            return this.defaultValue;
        this.checkType(this.type, value);
        this.checkLength(this.length, this.type, value);
        return this.check(value);
    }

    check = function (value) {
        // convert exit_hour_to_work to id
        let slot = value;
        if (slot) {
            slot = this.propertiesCategories[this.category][slot]["NAME"];
            slot = this.getTimeSlotID(slot);
            if (!slot) {
                throw new ColumnError(ERROR_CODES.INPUT_ERROR, `הערך ${value} ב ${this.title} אינו תקין`);
            }
        }
        return slot;
    }
}

module.exports = { TimeSlot }