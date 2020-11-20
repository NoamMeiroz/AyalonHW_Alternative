"use strict";

const Employer = require('./employer');

module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define("employees", {
    EMPLOYER_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        // This is a reference to another model
        model: 'Employer',
        // This is the column name of the referenced model
        key: 'id'
      }
    },
    WORKER_ID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    CITY: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    STREET: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    BUILDING_NUMBER: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    X: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    Y: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    WORK_SITE: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        // This is a reference to another model
        model: 'EmployerSites',
        // This is the column name of the referenced model
        key: 'id'
      }
    },
    BEST_ROUTE: {
      type: Sequelize.JSON
    },
    SHORT_HOURS_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    SHIFTING_HOURS_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    BICYCLE_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    SCOOTER_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    PERSONALIZED_SHUTTLE_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    WORK_SHUTTLE_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    CARSHARE_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    CARPOOL_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    CABSHARE_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    PUBLIC_TRANSPORT_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    WALKING_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    WORKING_FROM_HOME_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    SHARED_WORKSPACE_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    },
    SHIFTING_WORKING_DAYS_GRADE: {
      type: Sequelize.DECIMAL(9, 3),
      allowNull: true
    }
  });
  return Employee;
};