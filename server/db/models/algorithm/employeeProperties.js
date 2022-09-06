module.exports = (sequelize, Sequelize) => {
    var EmployeeProperty = sequelize.define("employee_properties", {
        CODE: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },      
        NAME: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        TYPE: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        OBJ_COLUMN_NAME: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        IS_INCLUDED_IN_MARK: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    },
    {
        freezeTableName: true
      });
    return EmployeeProperty;
  };