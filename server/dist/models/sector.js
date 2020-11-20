module.exports = (sequelize, Sequelize) => {
  var Sector = sequelize.define("sector", {
    SECTOR: {
      type: Sequelize.STRING(50),
      allowNull: false
    }
  });
  return Sector;
};