const db = require("./database");
const { getMessage } = require("./errorCode");
const { loadingStatus } = require("./employerSchema");
const { isInteger } = require("../tools");
const { ServerError } = require("../log");
const { Sequelize, sequelize } = require("./database");
const Employee = db.employee;
const Employer = db.employer;
const EmployerSites = db.employerSites;
const TimeSlots = db.timeSlots;
const SoltionDisqualifyReason = db.solutionDisqualifyReasons;
const Op = Sequelize.Op;

/**
 * Insert employee object
 * @param {*} employee
 * @param {*} callback
 */
const insert = (employee, callback) => {
  // Save in the database
  Employee.create(employee)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, getMessage(err));
    });
};

/**
 * Insert a bulk of emplyees with one sql statement
 * @param {*} employees
 * @param {*} callback
 */
const insertBulk = (employees, callback) => {
  // Save  in the database
  Employee.bulkCreate(employees)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, getMessage(err));
    });
};

/**
 * Update a bulk of emplyees with one sql statement
 * @param {*} employees
 * @param {*} callback
 */
const updateBulk = (employees, callback) => {
  // Save  in the database
  Employee.bulkCreate(employees, {
    updateOnDuplicate: [
      "BEST_ROUTE_TO_WORK",
      "BEST_ROUTE_TO_HOME",
      "FINAL_SHORT_HOURS_GRADE",
      "FINAL_SHIFTING_HOURS_GRADE",
      "FINAL_BICYCLE_GRADE",
      "FINAL_SCOOTER_GRADE",
      "FINAL_PERSONALIZED_SHUTTLE_GRADE",
      "FINAL_WORK_SHUTTLE_GRADE",
      "FINAL_CARSHARE_GRADE",
      "FINAL_CARPOOL_GRADE",
      "FINAL_CABSHARE_GRADE",
      "FINAL_PUBLIC_TRANSPORT_GRADE",
      "FINAL_WALKING_GRADE",
      "FINAL_WORKING_FROM_HOME_GRADE",
      "FINAL_SHARED_WORKSPACE_GRADE",
      "FINAL_SHIFTING_WORKING_DAYS_GRADE",
      "BEST_ROUTE_TO_HOME_WALKING_DISTANCE",
      "BEST_ROUTE_TO_HOME_WALKING_DURATION",
      "BEST_ROUTE_TO_HOME_DRIVING_DISTANCE",
      "BEST_ROUTE_TO_HOME_DRIVING_DURATION",
      "BEST_ROUTE_TO_HOME_TRANSIT_DISTANCE",
      "BEST_ROUTE_TO_HOME_TRANSIT_DURATION",
      "BEST_ROUTE_TO_HOME_BICYCLING_DISTANCE",
      "BEST_ROUTE_TO_HOME_BICYCLING_DURATION",
      "BEST_ROUTE_TO_WORK_WALKING_DISTANCE",
      "BEST_ROUTE_TO_WORK_WALKING_DURATION",
      "BEST_ROUTE_TO_WORK_DRIVING_DISTANCE",
      "BEST_ROUTE_TO_WORK_DRIVING_DURATION",
      "BEST_ROUTE_TO_WORK_TRANSIT_DISTANCE",
      "BEST_ROUTE_TO_WORK_TRANSIT_DURATION",
      "BEST_ROUTE_TO_WORK_BICYCLING_DISTANCE",
      "BEST_ROUTE_TO_WORK_BICYCLING_DURATION",
      "updatedAt",
    ],
  })
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, getMessage(err));
    });
};

/**
 * Delete all employees of employer
 * @param {*} employerID
 * @param {*} callback
 */
const deleteEmployees = (employerID, callback) => {
  Employee.destroy({
    returning: true,
    where: { employer_id: employerID },
  })
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, getMessage(err));
    });
};

/**
 * Return list of employees of specific employer
 * @param {int} employerId
 * @param {[]} livingCity  - list of cities names where employees live
 * @param {[]} workingCity  - list of cities names where employees works
 * @param {*} callback
 */
const getEmployeesOfEmployer = (
  employerId,
  livingCity = [],
  workingCity = [],
  callback
) => {
  let whereClause = {
    where: {
      employer_id: employerId,
    },
  };
  if (livingCity && livingCity.length > 0)
    whereClause.where.CITY = { [Op.in]: livingCity };
  let include = [
    { model: EmployerSites, as: "Site" },
    { model: Employer, as: "employer" },
    { model: TimeSlots, as: "ExitHourToWork" },
    { model: TimeSlots, as: "ReturnHourToHome" },
    { model: SoltionDisqualifyReason, as: "BicycleDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "WorkShuttleDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "CompoundShuttleDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "CarpoolDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "PublicTransportDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "WalkingDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "WorkingFromHomeDisqualifyReason"}
  ];
  if (workingCity && workingCity.length > 0)
    include[0].where = { ADDRESS_CITY: { [Op.in]: workingCity } };

  whereClause = { ...whereClause, include };
  Employee.findAll(whereClause)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, getMessage(err));
    });
};

const getWhereForMarks = (marks) => {
  const MIN_VALUE_COLUMN = 0;
  const MAX_VALUE_COLUMN = 1;
  const ABSOLUTE_MIN_VALUE = -1000000;
  const ABSOLUTE_MAX_VALUE = 16;
  const MARK_COLUMNS = [
    "FINAL_BICYCLE_GRADE",
    "FINAL_WORK_SHUTTLE_GRADE",
    "FINAL_COMPOUND_SHUTTLE_GRADE",
    "FINAL_CARPOOL_GRADE",
    "FINAL_PUBLIC_TRANSPORT_GRADE",
    "FINAL_WALKING_GRADE",
    "FINAL_WORKING_FROM_HOME_GRADE",
  ];
  let whereClause = {};
  for (const mark in marks) {
    let min_value = marks[mark][MIN_VALUE_COLUMN];
    let max_value = marks[mark][MAX_VALUE_COLUMN];
    if (!MARK_COLUMNS.includes(mark))
      throw new ServerError(400, "Unknown mark column");
    if (min_value === undefined || !isInteger(min_value))
      throw new ServerError(400, "Minimum value is missing or invalid");
    if (max_value === undefined || !isInteger(max_value))
      throw new ServerError(400, "Maximum value is missing or invalid");
    let filter = {};
    // include all negetive grades
    if (min_value === -1) min_value = ABSOLUTE_MIN_VALUE;
    // check if to include current column in where.
    // if all values are needed then don't include.
    if (min_value !== ABSOLUTE_MIN_VALUE || max_value !== ABSOLUTE_MAX_VALUE) {
      filter[mark] = { [Op.between]: [min_value, max_value] };
      whereClause = { ...whereClause, ...filter };
    }
  }
  return whereClause;
};

getWhereForDestinationPolygon = (destinationPolygon) => {
  let filter = null;
  if (!destinationPolygon || !destinationPolygon.geometry) return filter;

  let polygon = Sequelize.fn(
    "ST_GEOMFROMGEOJSON",
    JSON.stringify(destinationPolygon.geometry)
  );
  let point = Sequelize.fn(
    "ST_GeomFromText",
    Sequelize.fn(
      "ST_AsText",
      Sequelize.fn("POINT", Sequelize.col("Site.X"), Sequelize.col("Site.Y"))
    ),
    4326
  );
  if (Object.keys(destinationPolygon).length > 0) {
    filter = Sequelize.where(
      Sequelize.fn("ST_CONTAINS", polygon, point),
      "=",
      1
    );
    //filter = Sequelize.fn('ST_CONTAINS', polygon, point);
  }
  return filter;
};

getWhereForStartingPolygon = (startingPolygon) => {
  let filter = null;
  if (!startingPolygon || !startingPolygon.geometry) return filter;

  let polygon = Sequelize.fn(
    "ST_GEOMFROMGEOJSON",
    JSON.stringify(startingPolygon.geometry)
  );
  let point = Sequelize.fn(
    "ST_GeomFromText",
    Sequelize.fn(
      "ST_AsText",
      Sequelize.fn(
        "POINT",
        Sequelize.col("employees.X"),
        Sequelize.col("employees.Y")
      )
    ),
    4326
  );
  if (Object.keys(startingPolygon).length > 0) {
    filter = Sequelize.fn("ST_CONTAINS", polygon, point);
  }
  return filter;
};

/**
 * Return any employee working in one of the a given employers
 * @param {*} employerList
 * @param {*} livingCity
 * @param {*} workingCity
 * @param {*} compounds
 * @param {*} timeSlotWork
 * @param {*} timeSlotHome
 * @param {*} marks
 * @param {*} destinationPolygon
 * @param {*} startingPolygon
 * @param {*} callback
 */
const getEmployees = (
  employerList,
  livingCity = [],
  workingCity = [],
  compounds = [],
  timeSlotWork = [],
  timeSlotHome = [],
  marks = {},
  destinationPolygon = {},
  startingPolygon = {},
  callback
) => {
  let whereClause = {
    attributes: {
      exclude: [
        "SHORT_HOURS_GRADE",
        "SHIFTING_HOURS_GRADE",
        "BICYCLE_GRADE",
        "SCOOTER_GRADE",
        "PERSONALIZED_SHUTTLE_GRADE",
        "WORK_SHUTTLE_GRADE",
        "CARSHARE_GRADE",
        "CARPOOL_GRADE",
        "CABSHARE_GRADE",
        "PUBLIC_TRANSPORT_GRADE",
        "WALKING_GRADE",
        "WORKING_FROM_HOME_GRADE",
        "SHARED_WORKSPACE_GRADE",
        "SHIFTING_WORKING_DAYS_GRADE",
        "updatedAt",
        "createdAt",
        "BEST_ROUTE_TO_HOME",
        "BEST_ROUTE_TO_WORK",
      ],
    },
    where: {
      [Op.and]: [
        {
          X: {
            [Op.ne]: null,
          },
        },
      ],
    },
  };
  // add starting polygon to where clause
  if (startingPolygon) {
    let filter = getWhereForStartingPolygon(startingPolygon);
    if (filter) {
      whereClause.where[Op.and].push(filter);
    }
  }
  if (employerList && employerList.length > 0)
    whereClause.where.employer_id = { [Op.in]: employerList };
  if (livingCity && livingCity.length > 0)
    whereClause.where.CITY = { [Op.in]: livingCity };
  let include = [
    { model: EmployerSites, as: "Site" },
    { model: Employer, as: "employer" },
    { model: TimeSlots, as: "ExitHourToWork" },
    { model: TimeSlots, as: "ReturnHourToHome" },
    { model: SoltionDisqualifyReason, as: "BicycleDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "WorkShuttleDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "CompoundShuttleDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "CarpoolDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "PublicTransportDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "WalkingDisqualifyReason"},
    { model: SoltionDisqualifyReason, as: "WorkingFromHomeDisqualifyReason"}
  ];
  if (timeSlotWork && timeSlotWork.length > 0)
    whereClause.where.EXIT_HOUR_TO_WORK = { [Op.in]: timeSlotWork };
  if (timeSlotHome && timeSlotHome.length > 0)
    whereClause.where.RETURN_HOUR_TO_HOME = { [Op.in]: timeSlotHome };
  if (marks) {
    let filter = getWhereForMarks(marks);
    whereClause.where = { ...whereClause.where, ...filter };
  }
  // add destination polygon to include where clause (of site)
  if (destinationPolygon) {
    let filter = getWhereForDestinationPolygon(destinationPolygon);
    if (filter) {
      include[0].where = filter; //{...whereClause.where, ...filter};
    }
  }

  // working city where condition (in site)
  if (workingCity && workingCity.length > 0) {
    if (include[0].where)
      include[0].where = {
        [Op.and]: [
          { ADDRESS_CITY: { [Op.in]: workingCity } },
          include[0].where,
        ],
      };
    else include[0].where = { ADDRESS_CITY: { [Op.in]: workingCity } };
  }

  // compound where condition (in site)
  if (compounds && compounds.length > 0) {
    if (include[0].where)
      include[0].where = {
        [Op.and]: [{ COMPOUND: { [Op.in]: compounds } }, include[0].where],
      };
    else include[0].where = { COMPOUND: { [Op.in]: compounds } };
  }

  // combine to create a final where
  whereClause = { ...whereClause, include };
  Employee.findAll(whereClause)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, getMessage(err));
    });
};

/**
 * Return % of finished calculation on employees
 * @param {int} employerID
 * @param {*} callback
 */
const getPrecentFinished = (employerID, callback) => {
  // check if finished with employees by checking the status in the employers table
  loadingStatus(employerID, (err, data) => {
    if (err) callback(err, getMessage(err));
    // if result is true return 100 precent;
    else if (data) {
      callback(null, 100);
    }
    //
    else {
      Promise.all([
        Employee.count({
          where: {
            [Op.and]: [
              { EMPLOYER_ID: employerID },
              {
                [Op.or]: [
                  {
                    [Op.and]: [
                      {
                        UPLOAD_ERROR: {
                          [db.Sequelize.Op.eq]: null,
                        },
                      },
                      {
                        BEST_ROUTE_TO_HOME: {
                          [db.Sequelize.Op.ne]: null,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        UPLOAD_ERROR: {
                          [db.Sequelize.Op.ne]: null,
                        },
                      },
                      {
                        BEST_ROUTE_TO_HOME: {
                          [db.Sequelize.Op.eq]: null,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        }),
        EmployerSites.sum("NUM_OF_EMPLOYEES", {
          where: {
            EMPLOYER_ID: employerID,
          },
        }),
      ])
        .then((results) => {
          let countFinished = results[0];
          let precent = 0;
          let total = results[1];
          if (countFinished === 0) precent = 0;
          else {
            precent = Math.ceil((countFinished / total) * 100);
          }
          callback(null, precent);
        })
        .catch((err) => {
          callback(err, getMessage(err));
        });
    }
  });
};

/**
 * Clear all google suggested routes of a given employer by its id
 * @param {*} employerID
 * @param {*} callback
 */
const cleanBestRoute = (employerID, callback) => {
  // Save  in the database
  Employee.update(
    {
      BEST_ROUTE_TO_HOME: null,
      BEST_ROUTE_TO_HOME_WALKING_DISTANCE: null,
      BEST_ROUTE_TO_HOME_WALKING_DURATION: null,
      BEST_ROUTE_TO_HOME_DRIVING_DISTANCE: null,
      BEST_ROUTE_TO_HOME_DRIVING_DURATION: null,
      BEST_ROUTE_TO_HOME_TRANSIT_DISTANCE: null,
      BEST_ROUTE_TO_HOME_TRANSIT_DURATION: null,
      BEST_ROUTE_TO_HOME_BICYCLING_DISTANCE: null,
      BEST_ROUTE_TO_HOME_BICYCLING_DURATION: null,
      BEST_ROUTE_TO_WORK: null,
      BEST_ROUTE_TO_WORK_WALKING_DISTANCE: null,
      BEST_ROUTE_TO_WORK_WALKING_DURATION: null,
      BEST_ROUTE_TO_WORK_DRIVING_DISTANCE: null,
      BEST_ROUTE_TO_WORK_DRIVING_DURATION: null,
      BEST_ROUTE_TO_WORK_TRANSIT_DISTANCE: null,
      BEST_ROUTE_TO_WORK_TRANSIT_DURATION: null,
      BEST_ROUTE_TO_WORK_BICYCLING_DISTANCE: null,
      BEST_ROUTE_TO_WORK_BICYCLING_DURATION: null,
    },
    { where: { EMPLOYER_ID: employerID } }
  )
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, getMessage(err));
    });
};

module.exports = {
  insertBulk,
  getEmployeesOfEmployer,
  getPrecentFinished,
  getEmployees,
  updateBulk,
  cleanBestRoute,
};
