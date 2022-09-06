module.exports = (sequelize, Sequelize) => {
    var SolutionLimit = sequelize.define("solution_limits", {
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
        LIMIT_NAME: {
            type: Sequelize.STRING(100),
            allowNull: false,    
        },
        TYPE: {
            type: Sequelize.STRING(10),
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
    return SolutionLimit;
  };