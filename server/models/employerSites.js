const Employer = require('./employer');

module.exports = (sequelize, Sequelize) => {
    var EmployerSites = sequelize.define("employers_sites", {
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
        SITE_ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }, 
        NAME: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        ADDRESS_CITY: {
            type: Sequelize.STRING(45),
            allowNull: false
        },   
        ADDRESS_STREET: {
            type: Sequelize.STRING(45),
            allowNull: false
        },   
        ADDRESS_BUILDING_NUMBER: {
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
        NUM_OF_EMPLOYEES: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    }
    );
    return EmployerSites;
  };