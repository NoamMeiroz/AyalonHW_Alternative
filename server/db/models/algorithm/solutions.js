module.exports = (sequelize, Sequelize) => {
    var Solution = sequelize.define("solutions", {
        CODE: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }, 
        NAME: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        SURVAY_RANK: {
            type: Sequelize.INTEGER,
            allowNull: false,    
        },
        OBJ_COLUMN_NAME: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
    },
    {
        freezeTableName: true
      });
    return Solution;
  };