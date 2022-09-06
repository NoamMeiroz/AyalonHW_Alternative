module.exports = (sequelize, Sequelize) => {
    var SurveyAnswerCode = sequelize.define("survey_answer_codes", {
        QUESTION_COLUMN_NAME: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        ANSWER_VALUE: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }, 
        PROPERTY_CATEGORIES: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                // This is a reference to another model
                model: 'PropertyCategory',
                // This is the column name of the referenced model
                key: 'id'
            }       
        }, 
        PROPERTY_CODE: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        }, 
        PROPERTY_VALUE: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        }
    },
    {
        freezeTableName: true
      });
    return SurveyAnswerCode;
  };