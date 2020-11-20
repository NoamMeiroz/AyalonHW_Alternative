const Sector = require('./sector');

module.exports = (sequelize, Sequelize) => {
  const Employer = sequelize.define("employers", {
    NAME: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    SECTOR: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        // This is a reference to another model
        model: Sector,
        // This is the column name of the referenced model
        key: 'id'
      }
    },
    PRIVATE_CAR_SOLUTION: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    SHUTTLE_SOLUTION: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    MASS_TRANSPORTATION_SOLUTION: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    CAR_POOL_SOLUTION: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    WORK_FROM_HOME_SOLUTION: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    EMPLOYEES_READY: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  });
  return Employer;
};