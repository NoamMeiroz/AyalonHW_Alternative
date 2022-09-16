module.exports = (sequelize, Sequelize) => {
    var SolutionDisqualifyReason = sequelize.define("solution_disqualify_reasons", {
        REASON: {
            type: Sequelize.STRING(100),
            allowNull: false,    
        },
    },
    {
        freezeTableName: true
      });
    return SolutionDisqualifyReason;
  };