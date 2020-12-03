module.exports = (sequelize, Sequelize) => {
    var Locality = sequelize.define("locality", {
        CODE: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }, 
        NAME: {
            type: Sequelize.STRING(100),
            allowNull: false
        }
    },
    {
        freezeTableName: true
      });
    return Locality;
  };