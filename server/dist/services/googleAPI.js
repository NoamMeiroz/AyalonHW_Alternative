const axios = require('axios');

const proj4 = require('proj4');

const {
  ServerError,
  logger
} = require('../log');

const tools = require('../tools');

const {
  debug
} = require('winston');

const ERRORS = {
  INVALID_ADDRESS_CODE: 1000,
  MISSING_CITY_CODE: 1001,
  MISSING_STREET_CODE: 1002,
  MISSING_BUILDING_NUMBER_CODE: 1003,
  MISSING_ORIGIN_CODE: 1004,
  MISSING_DESTINATION_CODE: 1005
};
const LOCATION_TYPE = ["street_address", "route", "establishment", "hospital"];

function convertCoordinate(location) {
  const secondProjection = "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs";
  const x = location["lat"];
  const y = location["lng"];
  const result = {
    X: x,
    Y: y
  }; //const converted_xy = proj4(proj4.defs["EPSG:4326"], secondProjection, [x, y]);
  //const result = { X: converted_xy[0], Y: converted_xy[1] };

  return result;
}

checkResults = payload => {
  let status = payload.status;
  let result = null;

  switch (status) {
    case 'OK':
      break;

    case 'REQUEST_DENIED':
      result = new ServerError(500, "Google api denied the request");
      break;

    case 'ZERO_RESULTS':
      result = new ServerError(ERRORS.INVALID_ADDRESS_CODE, "Invalid address");
      break;

    default:
      result = new ServerError(500, "Google api denied the request: " + status);
      break;
  }

  return result;
};

getCoordinates = payload => {
  let location = [];
  let result = {};

  if (payload.results) {
    if (payload.results.length > 0 && LOCATION_TYPE.some(value => payload.results[0].types.includes(value))) {
      if (payload.results[0].geometry) {
        location = payload.results[0].geometry.location;

        if (location) {
          result = convertCoordinate(location);
        } else result = new ServerError(500, "Google api is different then expected.");
      } else result = new ServerError(500, "Google api is different then expected.");
    } else result = new ServerError(ERRORS.INVALID_ADDRESS_CODE, "Invalid address");
  } else result = new ServerError(500, "Google api is different then expected.");

  return result;
};
/**
 * Call api google to translate address to X,Y coordinates in israel new network system
 * @param {String} city 
 * @param {String} street 
 * @param {int} buildingNumber 
 */


const convertLocation = async (city, street, buildingNumber) => {
  return new Promise(function (resolve, reject) {
    if (!city) {
      return resolve(new ServerError(ERRORS.MISSING_CITY_CODE, "missing city"));
    }

    if (!street) {
      return resolve(new ServerError(ERRORS.MISSING_STREET_CODE, "missing street"));
    }

    if (buildingNumber === null) {
      return resolve(new ServerError(ERRORS.MISSING_BUILDING_NUMBER_CODE, "missing building number"));
    }

    let address = `${street} ${buildingNumber}, ${city}`;
    address = encodeURI(address);
    let key = process.env.GOOGLE_API_KEY;
    url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=iw&key=${key}`;
    axios.get(url).then(res => {
      let result = checkResults(res.data);
      if (result instanceof ServerError) return reject(result);else {
        result = getCoordinates(res.data);
        resolve(result);
      }
    }).catch(err => {
      reject(err);
    });
  });
};

const checkRouteResults = payload => {
  let status = payload.status;
  let result = null;

  switch (status) {
    case 'OK':
      break;

    case 'REQUEST_DENIED':
      result = new ServerError(500, "Google api denied the request");
      break;

    case 'NOT_FOUND':
      result = {};
      break;

    case 'ZERO_RESULTS':
      result = {};
      break;

    default:
      result = new ServerError(500, "Google api denied the request: " + status);
      break;
  }

  return result;
};

const getRoutes = async (origin, destination) => {
  return new Promise(function (resolve, reject) {
    if (!origin) {
      return resolve(new ServerError(ERRORS.MISSING_ORIGIN_CODE, "missing origin"));
    }

    if (!destination) {
      return resolve(new ServerError(ERRORS.MISSING_DESTINATION_CODE, "missing destination"));
    }

    if (!origin.city) {
      return resolve(new ServerError(ERRORS.MISSING_CITY_CODE, "missing city"));
    }

    if (!origin.street) {
      return resolve(new ServerError(ERRORS.MISSING_STREET_CODE, "missing street"));
    }

    if (origin.buildingNumber === null) {
      return resolve(new ServerError(ERRORS.MISSING_BUILDING_NUMBER_CODE, "missing building number"));
    }

    if (!destination.city) {
      return resolve(new ServerError(ERRORS.MISSING_CITY_CODE, "missing city"));
    }

    if (!destination.street) {
      return resolve(new ServerError(ERRORS.MISSING_STREET_CODE, "missing street"));
    }

    if (destination.buildingNumber === null) {
      return resolve(new ServerError(ERRORS.MISSING_BUILDING_NUMBER_CODE, "missing building number"));
    }

    let originAddr = origin.street + origin.buildingNumber + ", " + origin.city;
    originAddr = encodeURI(originAddr);
    let destinationAddr = destination.street + destination.buildingNumber + ", " + destination.city;
    destinationAddr = encodeURI(destinationAddr);
    let key = process.env.GOOGLE_API_KEY;
    let modeList = ['transit', 'bicycling', 'walking', 'driving'];
    let promiseList = [];
    let time = tools.getNearestWorkDay(new Date());
    modeList.forEach((mode, index, array) => {
      params = `origin=${originAddr}&destination=${destinationAddr}&mode=${mode}&language=iw&departure_time=${time}&alternatives=true&key=${key}`;
      url = `https://maps.googleapis.com/maps/api/directions/json?${params}`;
      promiseList.push(axios.get(url));
    });
    let suggestedRoutes = {};
    Promise.all(promiseList).then(routesResponeList => {
      suggestedRoutes = {};
      routesResponeList.forEach((res, index, array) => {
        error = checkRouteResults(res.data);

        if (!error) {
          suggestedRoutes[modeList[index]] = res.data.routes;
        } else if (error === {}) suggestedRoutes[modeList[index]] = {
          error: "לא נמצא מסלול"
        };else {
          suggestedRoutes[modeList[index]] = {
            error: "שגיאה במערכת. לא ניתן לחשב מסלול"
          };
          logger.error(error.stack);
        }
      });
      return resolve(suggestedRoutes);
    }).catch(error => {
      logger.error(error.stack);
      modeList.forEach((mode, index, array) => {
        suggestedRoutes[mode] = {
          error: "שגיאה במערכת. לא ניתן לחשב מסלול"
        };
      });
      resolve(suggestedRoutes);
    });
  });
};

module.exports = {
  convertLocation,
  getRoutes,
  ERRORS
};