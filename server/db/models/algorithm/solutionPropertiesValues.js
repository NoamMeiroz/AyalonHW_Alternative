module.exports = (sequelize, Sequelize) => {
    var SolutionProperty = sequelize.define("solution_property", {
        SOLUTION_CODE: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                // This is a reference to another model
                model: 'Solution',
                // This is the column name of the referenced model
                key: 'CODE'
            } 
        }, 
        PROPERTY_CODE: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        CATEGORY_CODE: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        VALUE: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        },
    },
    {
        freezeTableName: true
      });
    return SolutionProperty;
  };