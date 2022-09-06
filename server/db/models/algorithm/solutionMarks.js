module.exports = (sequelize, Sequelize) => {
    var SolutionMark = sequelize.define("solution_marks", {
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
        AVG_AGREEMENT: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        },
        MULTI: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        },
        POSITIVE_MARK: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        },
        NEGATIVE_MARK: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        },
        NUETRAL_MARK: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        },
        DISQUALIFIED_MARK: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        },
    },
    {
        freezeTableName: true
      });
    return SolutionMark;
  };