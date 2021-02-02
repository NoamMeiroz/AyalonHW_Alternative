module.exports = (sequelize, Sequelize) => {
    var Configuration = sequelize.define("configuration", {
        NAME: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        VALUE: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        TYPE: {
            type: Sequelize.STRING(45),
            allowNull: false
        }
    },
    {
        freezeTableName: true
      });
    return Configuration;
  };