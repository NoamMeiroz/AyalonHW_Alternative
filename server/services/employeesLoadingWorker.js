const { workerData, parentPort } = require("worker_threads");
const employeeSchema = require("../db/employeeSchema");
const empFields = require("../config/config").employeeFieldsName;
const DEFAULT_EXIT_HOUR = require("../config/config").DEFAULT_EXIT_HOUR_TO_WORK;
const DEFAULT_RETURN_HOUR =
  require("../config/config").DEFAULT_RETURN_HOUR_TO_HOME;

const { getNearestWorkDay } = require("../tools");
const googleAPI = require("./googleAPI");
const configData = require("./data/configData");
const timeSlotsData = require("./data/timeSlotsData");
const localityData = require("./data/localityData");
const streetsData = require("./data/streetsData");
const employeePropertiesData = require("./data/employeePropertiesData");
const surveyAnswerCodesData = require("./data/surveyAnswerCodesData");
const solutionsData = require("./data/solutionsData");
const propertyCategoriesData = require("./data/propertyCategoriesData");


const { ERRORS } = require("./ERRORS");
const { ServerError, logger } = require("../log");
const { Column, TYPES } = require("./columns/column");
const { CityCode } = require("./columns/cityCode");
const { calculateDurationAndDistance } = require("./route");
const { calculateMarks } = require("./algorithmService");

/**----------------------------------------------------------
 * Healper functions
 -----------------------------------------------------------*/

const save = async function (employee) {
  return new Promise(function (resolve, reject) {
    // save all employees in the db
    employeeSchema.insertBulk(employee, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(data);
    });
  });
};

/**
 * Return id of timeslot HOUR
 * @param {*} timeSlot
 */
const getTimeSlotHour = (timeSlot) => {
  let currentSlot = timeSlots.filter((slot) => slot.id === timeSlot);
  if (currentSlot.length > 0) return currentSlot[0].HOUR;
  else throw new ServerError(ERRORS.TIME_SLOT_NOT_FOUND, timeSlot);
};

const findRoutes = async function (employee, sites) {
  return new Promise(async function (resolve, reject) {
    promiseList = [];
    // check if the employee UPLOAD_ERROR is empty.
    // if not then there is a problem with this employee address
    if (employee.UPLOAD_ERROR) {
      resolve(employee);
    }
    let origin = {
      city: employee.CITY,
      street: employee.STREET,
      buildingNumber: employee.BUILDING_NUMBER,
    };

    // find the address of the office where the employees work
    workSite = sites.find((site) => {
      return site.id === employee.WORK_SITE;
    });
    let destination = {
      city: workSite.ADDRESS_CITY,
      street: workSite.ADDRESS_STREET,
      buildingNumber: workSite.ADDRESS_BUILDING_NUMBER,
    };

    // calculate routes from home to work for the nearest work day at
    // the hour the employee is going to work
    // the hour it utc and not local because of google api
    let timeSlot = 0;
    try {
      timeSlot = getTimeSlotHour(employee.EXIT_HOUR_TO_WORK);
    } catch (error) {
      logger.error(error.stack);
      employee.UPLOAD_ERROR = {
        error: "הערך בשעת יציאה ממקום העובדה אינו חוקי.",
      };
      return resolve(employee);
    }
    let time = getNearestWorkDay(new Date(), timeSlot);
    googleAPI
      .getRoutes(origin, destination, time)
      .then((routeResult) => {
        employee.BEST_ROUTE_TO_WORK = routeResult;
        return employee;
      })
      .then((empl) => {
        // calculate routes from home to work for the nearest work day at
        // the hour the employee is going to work
        // the hour it utc and not local because of google api
        let timeSlot = 0;
        try {
          timeSlot = getTimeSlotHour(empl.RETURN_HOUR_TO_HOME);
        } catch (error) {
          logger.error(error.stack);
          empl.UPLOAD_ERROR = {
            error: "הערך בשעת הגעה למקום העבודה אינו חוקי.",
          };
          return resolve(empl);
        }
        let time = getNearestWorkDay(new Date(), timeSlot);
        googleAPI
          .getRoutes(destination, origin, time)
          .then((routeHomeResult) => {
            empl.BEST_ROUTE_TO_HOME = routeHomeResult;
            return resolve(empl);
          })
          .catch((error) => {
            if (error instanceof ServerError) {
              empl.UPLOAD_ERROR = { error: error.message };
              return resolve(empl);
            }
            logger.error(error.stack);
            return reject(error);
          });
      })
      .catch((error) => {
        if (error instanceof ServerError) {
          empl.UPLOAD_ERROR = { error: error.message };
          return resolve(empl);
        }
        logger.error(error.stack);
        return reject(error);
      });
  });
};

/**
 * Find coordinates of a given employee
 * @param {Object} employee
 */
const findCoordinates = async (employee) => {
  return new Promise(async (resolve, reject) => {
    googleAPI
      .convertLocation(employee.CITY, employee.STREET, employee.BUILDING_NUMBER)
      .then((value) => {
        // check type of error and set an error message in UPLOAD_ERROR
        if (value instanceof ServerError) {
          switch (value.status) {
            case ERRORS.INVALID_ADDRESS_CODE:
              employee.UPLOAD_ERROR = { error: "כתובת העובד אינה תקינה." };
              break;
            case ERRORS.MISSING_CITY_CODE:
              employee.UPLOAD_ERROR = { error: "חסר ישוב מגורים" };
              employee.CITY = "____";
              break;
            case ERRORS.MISSING_STREET_CODE:
              employee.UPLOAD_ERROR = { error: "חסר שם רחוב" };
              employee.STREET = "____";
              break;
            case ERRORS.MISSING_BUILDING_NUMBER_CODE:
              employee.UPLOAD_ERROR = { error: "חסר מספר בניין" };
              employee.BUILDING_NUMBER = 0;
              break;
            case ERRORS.INVALID_CITY:
              employee.UPLOAD_ERROR = { error: "בעיית איות בשם העיר" };
              break;
            case ERRORS.INVALID_STREET:
              employee.UPLOAD_ERROR = { error: "בעיית איות בשם הרחוב" };
              break;
            case ERRORS.CITY_CODE_NOT_FOUND:
              logger.info(value);
              employee.X = value.X;
              employee.Y = value.Y;
              break;
            case ERRORS.HELKA_NOT_FOUND:
              logger.info(value);
              employee.X = value.X;
              employee.Y = value.Y;
              break;
            default:
              employee.UPLOAD_ERROR = { error: "שגיאה לא ידועה" };
              break;
          }
        }
        // there is no error so store X, Y coordinates
        else {
          employee.X = value.X;
          employee.Y = value.Y;
          employee.CITY = value.CITY;
        }
        return resolve(employee);
      })
      .catch((error) => {
        logger.error(error);
        return reject(error);
      });
  });
};

/**
 * Calcluare for each employee final marks, distance and duration of routes
 * @param {list of employees} employees
 * @param {count employees in each city} cityCount
 * @param {configuration} config
 */
const calculateRoutes = (employees) => {
  //result = employees.map((employee) => calculateMark(employee, config));

  result = employees.map((employee) => calculateDurationAndDistance(employee));

  result = result.map((employee) =>
    calculateMarks(
      employee,
      cityCount,
      config,
      solutions,
      surveyAnswerCode,
      employeeProperties,
      propertiesCategories
    )
  );

  return result;
};

/**
 * convert employee address to coordinates using google api
 * If an address is invalid then store the error in the UPLOAD_ERROR field of the same record
 * If no exception then save to db.
 * return results.
 */
const insertEmployee = async function (employeeList) {
  return new Promise(async function (resolve, reject) {
    let promiseList = [];
    // calculate coordination
    employeeList.forEach((employee) => {
      // find coordinates only if there is no error in the record
      if (employee.UPLOAD_ERROR === null)
        promiseList.push(findCoordinates(employee));
      else promiseList.push(employee);
    });
    Promise.all(promiseList)
      .then((employees) => {
        let promiseList = [];
        employees.forEach((employee) => {
          // find routes only to employees with valid address
          if (employee.UPLOAD_ERROR === null)
            promiseList.push(findRoutes(employee, employer.Sites));
          else promiseList.push(employee);
        });
        Promise.all(promiseList)
          .then((employees) => {
            let employeesList = calculateRoutes(employees);
            data = save(employeesList);
            return resolve(data);
          })
          .catch((error) => {
            return reject(error.stack);
          });
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

const getSiteID = (workSite, siteList) => {
  let currentSite = siteList.filter((site) => site.SITE_ID === workSite);
  return currentSite[0].id;
};

/**
 * Check count employess that have no error in the UPLOAD_ERROR feature.
 * @param {employeesList} employessList
 */
const checkResult = (employessList) => {
  let successCount = 0;
  let total = employessList.length;
  for (emp of employessList) {
    if (!emp.dataValues.UPLOAD_ERROR) successCount = successCount + 1;
  }
  return { successCount: successCount, total: total };
};

/**
 * Invoke the callback function at a given time from now (miliseconds)
 * @param {integer} waitTime in miliseconds
 * @param {function} callback
 * @param {list of employees as input to the callback} employeeList
 */
const runAndWait = async (waitTime, callback, employeeList) => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      callback(employeeList)
        .then((employees) => resolve(employees))
        .catch((error) => {
          reject(error);
        });
    }, waitTime);
  });
};

/**
 * Return name of city by code
 * @param {*} timeSlot
 */
const getStreetName = (streets, locality, streetCode) => {
  let currentStreet = streets.filter(
    (street) =>
      street.LOCALITY === locality && street.STREET_CODE === streetCode
  );
  if (currentStreet.length > 0) return currentStreet[0].STREET_NAME;
  else null;
};

/**----------------------------------------------------------
 * Main thread
 * -------------------------------------------------------- */

const employer = workerData.employer;
var employeeList = workerData.employees;
const sites = employer.Sites;
var timeSlots = [];
var locality = [];
var streets = [];
var solutions = [];
var surveyAnswerCode = [];
var employeeProperties = [];
var propertiesCategories = [];
var cityCount = {};

var EMP_COLUMNS = [];
// var EMP_GRADE_COLUMNS = [
//    new Column("SHORT_HOURS_GRADE", "קיצור שעות העבודה", TYPES.INT, 6, false),
//    new Column("SHIFTING_HOURS_GRADE", "הזזת זמן הגעה לעבודה", TYPES.INT, 6, false),
//    new Column("BICYCLE_GRADE", "דו גלגלי-אופניים", TYPES.INT, 6, false),
//    new Column("SCOOTER_GRADE", "דו גלגלי-קורקינט", TYPES.INT, 6, false),
//    new Column("PERSONALIZED_SHUTTLE_GRADE", "Shuttle On Demand", TYPES.INT, 6, false),
//    new Column("WORK_SHUTTLE_GRADE", "שאטלים מטעם העבודה", TYPES.INT, 6, false),
//    new Column("CARSHARE_GRADE", "Carshare/Vanshare", TYPES.INT, 6, false),
//    new Column("CARPOOL_GRADE", "Carpool/Vanpool", TYPES.INT, 6, false),
//    new Column("CABSHARE_GRADE", "מוניות שיתופיות", TYPES.INT, 6, false),
//    new Column("PUBLIC_TRANSPORT_GRADE", "תחבורה ציבורית (רכבת/רכבת קלה/אוטובוס/מונית שירות)", TYPES.INT, 6, false),
//    new Column("WALKING_GRADE", "הגעה רגלית", TYPES.INT, 6, false),
//    new Column("WORKING_FROM_HOME_GRADE", "עבודה מהבית", TYPES.INT, 6, false),
//    new Column("SHARED_WORKSPACE_GRADE", "עבודה במרכזים שיתופיים", TYPES.INT, 6, false),
//    new Column("SHIFTING_WORKING_DAYS_GRADE", "שינוי ימי הגעה לעבודה", TYPES.INT, 6, false)
// ];

var EMP_SURVEY_QUESTION = [
  new Column("SEX", "מהו המגדר שלך?", TYPES.INT, 1, true),
  new Column("AGE", "מהו גילך?", TYPES.INT, 3, true),
  new Column("PARKING", "מהו הסדר החניה שלך בעבודה?", TYPES.INT, 2, true),
  new Column("DRIVING_LICENSE", "האם יש לך רישיון נהיגה?", TYPES.INT, 1),
  new Column(
    "PICKUP_DISTANCE",
    "מהו מרחק סביר מבחינתך לתחנת איסוף, במידה ומתקיימות הסעות / נסיעות שיתופיות?",
    TYPES.INT,
    1,
    true
  ),
  new Column(
    "PREFERED_SULOTIONS",
    "לפנייך רשימת פתרונות הנוגעים לאופן ההגעה והחזרה. אנא סמן פתרונות בהם תשקול להשתמש אילו היו זמינים במקום העבודה שלך (ניתן לבחור יותר מתשובה אחת)",
    TYPES.STRING,
    20,
    true
  ),
  new Column(
    "EXIT_HOUR_TO_WORK",
    "מתי אתה מגיע מהבית לעבודה?",
    TYPES.INT,
    1,
    true
  ),
  new Column(
    "RETURN_HOUR_TO_HOME",
    "מתי אתה יוצא מהעבודה לכיוון הבית?",
    TYPES.INT,
    1,
    true
  ),
];

var config = [];
// init configuation from database
configData
  .getAllConfig()
  .then((configuration) => {
    config = configuration;
    return timeSlotsData.getTimeSlots();
  })
  // init timeSlots
  .then((data) => {
    timeSlots = data;
    return streetsData.getAllStreets();
  })
  // init streets
  .then((data) => {
    streets = data;
    return surveyAnswerCodesData.getAllSurveyAnswerCodes();
  })
  // init surveyAnswerCodes
  .then((data) => {
    surveyAnswerCode = data;
    return solutionsData.getAllSolutions();
  })
  // init solutions information
  .then((data) => {
    solutions = data;
    return propertyCategoriesData.getAllProperties();
  })
  // init properties categories 
  .then((data) => {
    propertiesCategories = data;
    return employeePropertiesData.getAllProperties();
  })
  // init employeeProperties
  .then((data) => {
    employeeProperties = data;
    return localityData.getAllLocality();
  })
  .then((data) => {
    // init locality (cities)
    locality = data;
    EMP_COLUMNS = [
      new Column(
        "WORKER_ID",
        "אנא ציין את מספר העובד שלך על מנת שהמעסיק יוכל לחזור אלייך עם הפתרון המתאים ביותר עבורך",
        TYPES.STRING,
        80,
        false
      ),
      new CityCode("CITY", "Q359|מה העיר ורחוב המגורים שלך? (עיר)", locality),
      new Column("STREET", "Q359|רחוב", TYPES.INT, 5, true),
    ];
    main();
  })
  .catch((error) => {
    logger.error(error.stack);
    // return result to main thread
    parentPort.postMessage({ Employees: null, message: error });
    process.exit(-1);
  });

const main = () => {
  // create list of employee object
  let empList = employeeList.map((emp) => {
    let error = "";
    let employee = {
      EMPLOYER_ID: employer.id,
      WORKER_ID: "מזהה כללי",
      WORK_SITE: getSiteID(emp[empFields.BRANCH_ID], sites),
      CITY: "",
      STREET: "",
      BUILDING_NUMBER: 0,
      UPLOAD_ERROR: null,
      BEST_ROUTE_TO_WORK: null,
      BEST_ROUTE_TO_HOME: null,
      EXIT_HOUR_TO_WORK: DEFAULT_EXIT_HOUR,
      RETURN_HOUR_TO_HOME: DEFAULT_RETURN_HOUR,
    //   FINAL_BICYCLE_GRADE: null,
    //   FINAL_WORK_SHUTTLE_GRADE: null,
    //   FINAL_COMPOUND_SHUTTLE_GRADE: null,
    //   FINAL_CARPOOL_GRADE: null,
    //   FINAL_PUBLIC_TRANSPORT_GRADE: null,
    //   FINAL_WALKING_GRADE: null,
    //   FINAL_WORKING_FROM_HOME_GRADE: null,
      TOP_SOLUTION_1: null,
      TOP_SOLUTION_2: null,
      TOP_SOLUTION_3: null,
      TOP_SOLUTION_4: null,
      TOP_SOLUTION_5: null,
      JOB_TYPE: "1", // until this field will be read from survey file it is always 1 (full time job)
    };

    // add solution columns marks
    solutions.forEach( solution => {
        emp[solution.OBJ_COLUMN_NAME] = null;
    })

    //let allColumns = EMP_COLUMNS.concat(EMP_GRADE_COLUMNS);
    let allColumns = EMP_COLUMNS.concat(EMP_SURVEY_QUESTION);
    for (const column of allColumns) {
      try {
        employee[column.name] = column.validityCheck(emp[column.title]);
      } catch (err) {
        error = err.message;
      }
    }
    // update cityCount
    if (employee.CITY) {
      if (cityCount[employee.CITY])
        cityCount[employee.CITY] = cityCount[employee.CITY] + 1;
      else cityCount[employee.CITY] = 1;
    }
    if (error !== "") employee.UPLOAD_ERROR = { error: error };
    else {
      // translate street name
      try {
        employee.STREET = getStreetName(
          streets,
          emp["Q359|מה העיר ורחוב המגורים שלך? (עיר)"],
          emp["Q359|רחוב"]
        );
        if (!employee.STREET)
          employee.UPLOAD_ERROR = `הערך ${
            emp["Q359|רחוב"]
          } ב ${"Q359|רחוב"} אינו תקין`;
      } catch (err) {
        error = err.message;
      }
      if (error !== "") employee.UPLOAD_ERROR = { error: error };
    }
    return employee;
  });

  logger.info(`employer ${employer.NAME}: calculation employees coordinates`);

  let awaitTime = 2000;
  let chunk = 5;
  let promiseList = [];
  // work on chunck of employees to avoid huge bulk insert and to much requests of the google api at once
  for (i = 0, j = empList.length; i < j; i += chunk) {
    employeesChunk = empList.slice(i, i + chunk);
    promise = runAndWait(
      awaitTime * (i / chunk),
      insertEmployee,
      employeesChunk
    );
    promiseList.push(promise);
  }

  // collect all employees to one list and return result to main thread.
  Promise.all(promiseList)
    .then((results) => {
      let empList = [];
      results.forEach((emplyees, index, array) => {
        empList = empList.concat(emplyees);
      });
      let payload = checkResult(empList);
      parentPort.postMessage({ Employees: payload });
      logger.info(`Finished loading employer ${employer.NAME} with success`);
    })
    .catch((error) => {
      console.log(error);
      logger.error(error);
      logger.info(`Finished loading employer ${employer.NAME} with error!`);
      // return result to main thread
      parentPort.postMessage({ Employees: null, message: error });
    });
};
