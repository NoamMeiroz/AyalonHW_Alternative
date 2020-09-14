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
            allowNull: false,
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
            allowNull: false,
        },
        X: {
            type: Sequelize.DECIMAL(9,3),
            allowNull: true,
        },
        Y: {
            type: Sequelize.DECIMAL(9,3),
            allowNull: true,
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
        }
    });
    return Employee;
  };

