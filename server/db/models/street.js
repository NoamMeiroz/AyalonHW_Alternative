module.exports = (sequelize, Sequelize) => {
    var Street = sequelize.define("streets", {
        LOCALITY: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }, 
        LOCALITY_NAME: {
            type: Sequelize.STRING(80),
            allowNull: false
        },
        STREET_CODE: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }, 
        STREET_NAME: {
            type: Sequelize.STRING(80),
            allowNull: false
        }
    },
    {
        freezeTableName: true
      });
    return Street;
  };