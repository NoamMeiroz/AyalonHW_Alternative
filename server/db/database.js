const Sequelize = require("sequelize");
const dbConfig = require("../config/config.js");
const MYSQL_SERVER = process.env.mysql_server || dbConfig.HOST;

const sequelize = new Sequelize('alternative', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: MYSQL_SERVER,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.configuration = require("./models/configuration.js")(sequelize, Sequelize);
db.user = require("./models/user.js")(sequelize, Sequelize);
db.employer = require("./models/employer.js")(sequelize, Sequelize);
db.sector = require("./models/sector.js")(sequelize, Sequelize);
db.locality = require("./models/locality.js")(sequelize, Sequelize);
db.timeSlots = require("./models/timeSlot.js")(sequelize, Sequelize);
db.employerSites = require("./models/employerSites.js")(sequelize, Sequelize);
db.employee = require("./models/employee.js")(sequelize, Sequelize);

db.employer.hasMany(db.employerSites, {foreignKey: "EMPLOYER_ID", as: "Sites"});
db.employerSites.belongsTo(db.employer, { foreignKey: "EMPLOYER_ID", as: 'employer' });

db.employer.hasMany(db.employee, {foreignKey: "EMPLOYER_ID", as: "Employees"});
db.employee.belongsTo(db.employer, { foreignKey: "EMPLOYER_ID", as: 'employer' });
db.employee.belongsTo(db.employerSites, { foreignKey: "WORK_SITE", as: 'Site' });
db.employee.belongsTo(db.timeSlots, { foreignKey: "EXIT_HOUR_TO_WORK", as: 'ExitHourToWork' });
db.employee.belongsTo(db.timeSlots, { foreignKey: "RETURN_HOUR_TO_HOME", as: 'ReturnHourToHome' });

module.exports = db;

