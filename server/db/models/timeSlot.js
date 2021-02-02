module.exports = (sequelize, Sequelize) => {
    var TimeSlots = sequelize.define("time_slots", {
        TIME_SLOT: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        HOUR: {
            type: Sequelize.TIME,
            allowNull: false
        },
        DIRECTION: {
            type: Sequelize.STRING(45),
            allowNull: false
        }
    },
    {
        freezeTableName: true
      });
    return TimeSlots;
  };