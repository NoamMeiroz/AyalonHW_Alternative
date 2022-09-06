module.exports = (sequelize, Sequelize) => {
    var PropertyCategory = sequelize.define("property_categories", {
        PROPERTY_CODE: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                // This is a reference to another model
                model: 'EmployeeProperty',
                // This is the column name of the referenced model
                key: 'CODE'
            } 
        }, 
        CATEGORY_CODE: {
            type: Sequelize.INTEGER,
            allowNull: false
        },        
        NAME: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        MIN_VALUE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        }, 
        MAX_VALUE: {
            type: Sequelize.INTEGER,
            allowNull: true
        }, 
    },
    {
        freezeTableName: true
      });
    return PropertyCategory;
  };