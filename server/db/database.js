const Sequelize = require("sequelize");
const dbConfig = require("../config/config.js");
const MYSQL_SERVER = process.env.mysql_server || dbConfig.DB;

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
db.street = require("./models/street.js")(sequelize, Sequelize);
// algorithm data model
db.surveyAnswerCode = require("./models/algorithm/surveyAnswerCodes.js")(sequelize, Sequelize);
db.propertyCategories = require("./models/algorithm/propertyCategories.js")(sequelize, Sequelize);
db.employeeProperties = require("./models/algorithm/employeeProperties.js")(sequelize, Sequelize);
db.solutions = require("./models/algorithm/solutions.js")(sequelize, Sequelize);
db.solutionMarks = require("./models/algorithm/solutionMarks.js")(sequelize, Sequelize);
db.solutionLimits = require("./models/algorithm/solutionLimits.js")(sequelize, Sequelize);
db.solutionPropertyValues = require("./models/algorithm/solutionPropertiesValues.js")(sequelize, Sequelize);
db.solutionDisqualifyReasons = require("./models/algorithm/solutionDisqualifyReasons.js")(sequelize, Sequelize);


db.employer.hasMany(db.employerSites, {foreignKey: "EMPLOYER_ID", as: "Sites"});
db.employerSites.belongsTo(db.employer, { foreignKey: "EMPLOYER_ID", as: 'employer' });

db.employer.hasMany(db.employee, {foreignKey: "EMPLOYER_ID", as: "Employees"});
db.employee.belongsTo(db.employer, { foreignKey: "EMPLOYER_ID", as: 'employer' });
db.employee.belongsTo(db.employerSites, { foreignKey: "WORK_SITE", as: 'Site' });
db.employee.belongsTo(db.timeSlots, { foreignKey: "EXIT_HOUR_TO_WORK", as: 'ExitHourToWork' });
db.employee.belongsTo(db.timeSlots, { foreignKey: "RETURN_HOUR_TO_HOME", as: 'ReturnHourToHome' });
db.employee.belongsTo(db.solutionDisqualifyReasons, { foreignKey: "BICYCLE_DISQUALIFY_REASON", as: 'BicycleDisqualifyReason' });
db.employee.belongsTo(db.solutionDisqualifyReasons, { foreignKey: "WORK_SHUTTLE_DISQUALIFY_REASON", as: 'WorkShuttleDisqualifyReason' });
db.employee.belongsTo(db.solutionDisqualifyReasons, { foreignKey: "COMPOUND_SHUTTLE_DISQUALIFY_REASON", as: 'CompoundShuttleDisqualifyReason' });
db.employee.belongsTo(db.solutionDisqualifyReasons, { foreignKey: "CARPOOL_DISQUALIFY_REASON", as: 'CarpoolDisqualifyReason' });
db.employee.belongsTo(db.solutionDisqualifyReasons, { foreignKey: "PUBLIC_TRANSPORT_DISQUALIFY_REASON", as: 'PublicTransportDisqualifyReason' });
db.employee.belongsTo(db.solutionDisqualifyReasons, { foreignKey: "WALKING_DISQUALIFY_REASON", as: 'WalkingDisqualifyReason' });
db.employee.belongsTo(db.solutionDisqualifyReasons, { foreignKey: "WORKING_FROM_HOME_DISQUALIFY_REASON", as: 'WorkingFromHomeDisqualifyReason' });


db.surveyAnswerCode.belongsTo(db.propertyCategories, {foreignKey: "PROPERTY_CATEGORIES", as: 'PropertyCategory' });

db.solutions.hasOne(db.solutionMarks, {foreignKey: "SOLUTION_CODE", as: "markInformation", sourceKey: 'CODE'});
db.solutions.hasMany(db.solutionLimits, {foreignKey: "SOLUTION_CODE", as: "limits", sourceKey: 'CODE'});
db.solutions.hasMany(db.solutionPropertyValues, {foreignKey: "SOLUTION_CODE", as: "propertyValues", sourceKey: 'CODE'});

db.solutionMarks.hasOne(db.solutions, {foreignKey: "CODE", as: 'Solution', sourceKey: 'SOLUTION_CODE' });
db.solutionPropertyValues.hasOne(db.solutions, {foreignKey: "CODE", as: 'Solution', sourceKey: 'SOLUTION_CODE' });
db.solutionPropertyValues.hasOne(db.employeeProperties, {foreignKey: "CODE", as: 'Property', sourceKey: 'PROPERTY_CODE' });

db.solutionLimits.hasOne(db.solutions, {foreignKey: "CODE", as: 'Solution', sourceKey: 'SOLUTION_CODE' });


module.exports = db;

