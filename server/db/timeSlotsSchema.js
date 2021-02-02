const db = require("./database");
const timeSlots = db.timeSlots;
const getMessage = require("./errorCode").getMessage;

const getAll = (callback) => {
    // Save Tutorial in the database
    timeSlots.findAll({
      order: [
        ['ID', 'ASC']
      ]
    }).then(data=>{callback(null, data)})
      .catch(err=>{callback(getMessage(err), false);});
  };

  const getExitToWork = (callback) => {
    // Save Tutorial in the database
    timeSlots.findAll({
      where: {
        DIRECTION: 'לעבודה'
      },
      order: [
        ['ID', 'ASC']
      ]
    }).then(data=>{callback(null, data)})
      .catch(err=>{callback(getMessage(err), false);});
  };

  const getReturnHome = (callback) => {
    // Save Tutorial in the database
    timeSlots.findAll({
      where: {
        DIRECTION: 'הביתה'
      },
      order: [
        ['ID', 'ASC']
      ]
    }).then(data=>{callback(null, data)})
      .catch(err=>{callback(getMessage(err), false);});
  };

  module.exports = { getAll, getReturnHome, getExitToWork };