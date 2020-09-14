const Sequelize = require("sequelize");
const dbConfig = require("../config/config.js");
const MYSQL_SERVER = process.env.mysql_server || dbConfig.HOST;

const sequelize = new Sequelize('alternative', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: MYSQL_SERVER,
  dialect: dbConfig.dialect,
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

db.user = require("../models/user.js")(sequelize, Sequelize);
db.employer = require("../models/employer.js")(sequelize, Sequelize);
db.sector = require("../models/sector.js")(sequelize, Sequelize);
db.employerSites = require("../models/employerSites.js")(sequelize, Sequelize);
db.employee = require("../models/employee.js")(sequelize, Sequelize);

db.employer.hasMany(db.employerSites, {foreignKey: "EMPLOYER_ID", as: "Sites"});
db.employerSites.belongsTo(db.employer, { foreignKey: "EMPLOYER_ID", as: 'employer' });

db.employer.hasMany(db.employee, {foreignKey: "EMPLOYER_ID", as: "Employees"});
db.employee.belongsTo(db.employer, { foreignKey: "EMPLOYER_ID", as: 'employer' });
db.employee.belongsTo(db.employerSites, { foreignKey: "WORK_SITE", as: 'Site' });


module.exports = db;

