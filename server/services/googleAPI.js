const axios = require('axios');
const proj4 = require('proj4');
const { ServerError, logger } = require('../log');
const tools = require('../tools');
const localityService = require('../services/localityData');
const { ERRORS } = require("./ERRORS");

const LOCATION_TYPE = ["street_address", "route", "establishment", "hospital", "neighborhood", "locality"];


/**
 * Convert X,Y in EPSG:4326 (WG84) to EPSG:2039
 * @param {*} x 
 * @param {*} y 
 */
function convertCoordinate(x, y) {
   const secondProjection = "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs";
   const converted_xy = proj4(proj4.defs["EPSG:4326"], secondProjection, [x, y]);
   const result = { X: converted_xy[0], Y: converted_xy[1] };
   return result;
}

checkResults = (payload) => {
   let status = payload.status;
   let result = null;
   switch (status) {
      case 'OK':
         break;
      case 'REQUEST_DENIED':
         result = new ServerError(500, "Google api denied the request");
         break;
      case 'ZERO_RESULTS':
         result = new ServerError(ERRORS.INVALID_ADDRESS_CODE, "Invalid address: " + JSON.stringify(payload));
         break;
      default:
         result = new ServerError(500, "Google api denied the request: " + JSON.stringify(payload));
         break;
   }
   if (!result) {
      let finish = false;
      for (let index = 0; index < payload.results.length && !finish; index++) {
         const location = payload.results[index];
         if (location.geometry.location_type === 'ROOFTOP' ||
            location.geometry.location_type === 'RANGE_INTERPOLATED') {
            result = index;
            finish = true;
         }
         else if (location.geometry.location_type === 'GEOMETRIC_CENTER' ||
            location.geometry.location_type === 'APPROXIMATE') {
            result = index;
         }
      }
   }
   if (result === null) {
      result = new ServerError(ERRORS.INVALID_ADDRESS_CODE, "Invalid address: " + JSON.stringify(payload));
   }
   return result;
}

getCoordinates = (payload, index) => {
   let location = [];
   let result = {};
   if (payload.results) {
      if ((payload.results.length > 0) &&
         (LOCATION_TYPE.some((value => payload.results[index].types.includes(value)))))
         if (payload.results[index].geometry) {
            location = payload.results[index].geometry.location;
            if (location) {
               const x = location["lat"];
               const y = location["lng"];
               result = { X: x, Y: y }
            }
            else
               result = new ServerError(500, "Google api is different then expected.");
         }
         else
            result = new ServerError(500, "Google api is different then expected.");
      else {
         result = new ServerError(ERRORS.INVALID_ADDRESS_CODE, "Invalid address: " + JSON.stringify(payload));
      }
   }
   else
      result = new ServerError(500, "Google api is different then expected.");
   return result;
}

/**
 * Call api google to translate address to X,Y coordinates in israel new network system.
 * If Successed it translation then find the true name of the city by using another api.
 * If the address is invalid then create ServerError with information about the address.
 * The ServerError in this case will be return as a resolve.
 * If there is a real error like exception or rejection from the api it will reject the error.
 * @param {String} city 
 * @param {String} street 
 * @param {int} buildingNumber 
 */
const convertLocation = async (cityParam, streetParam, buildingNumber) => {
   return new Promise(function (resolve, reject) {
      let address = "";
      if (buildingNumber === 0)
         address = `${streetParam}, ${cityParam}, ישראל`;
      else
         address = `${streetParam} ${buildingNumber}, ${cityParam}, ישראל`;
      address = encodeURI(address);
      let key = process.env.GOOGLE_API_KEY;
      url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=iw&key=${key}`;
      axios.get(url)
         .then((res) => {
            let result = checkResults(res.data);
            if (result instanceof ServerError) {
               return resolve(result)
            }
            else {
               // if valid coordinate then find the true name of the city
               // else return result by using resolve
               result = getCoordinates(res.data, result);
               if (result instanceof ServerError)
                  return resolve(result)
               else {
                  const converted = convertCoordinate(result.Y, result.X);
                  findLocality(cityParam, converted.X, converted.Y)
                  //findLocality(result.X, result.Y)
                     .then(locality => {
                        if (locality instanceof ServerError) {
                           locality.X = result.X;
                           locality.Y = result.Y;
                           return resolve(locality);
                        }
                        else {
                           result.CITY = locality;
                           return resolve(result);
                        }
                     })
                     .catch((err) => {
                        logger.error(err)
                        return reject(err);
                     });
               }
            }

         }).catch((err) => {
            return reject(err);
         });
   });
}

const findLocality = async (city, x, y) => {
   return new Promise(function (resolve, reject) {
      return resolve(localityService.getXYLocality(city, x, y));

   });
}

/**
 * Find city/settelment name by its coordinates.
 * The function uses the api form:
 * https://data-israeldata.opendata.arcgis.com/datasets/6e653612eece41faa34c1d0fe1bd919c_0/geoservice?geometry=34.3%2C31.593
 * @param {geocoding point} x, y 
 */
const findLocalityOld = async (x, y) => {
   return new Promise(function (resolve, reject) {
      let service = encodeURI('חלקות');
      let address = `${y},${x}`
      url = `https://services8.arcgis.com/JcXY3lLZni6BK4El/arcgis/rest/services/${service}/FeatureServer/0/query?where=1%3D1&outFields=LOCALITY_N,LOCALITY_I&geometry=${address}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&outSR=4326&f=json`
      axios.get(url)
         .then(res => {
            if (res.data.features.length > 0) {
               if (res.data.features[0].attributes.LOCALITY_I !== 0)
                  return localityService.getLocality(res.data.features[0].attributes.LOCALITY_I);
               else
                  return (resolve(new ServerError(ERRORS.HELKA_NOT_FOUND, "location is not mapped in service: " + address)));
            }
            else
               return (resolve(new ServerError(ERRORS.HELKA_NOT_FOUND, "location is not mapped in service: " + address)));
         })
         .then(result => {
            if (result instanceof ServerError)
               return resolve(result)
            else if (result)
               return resolve(result.NAME);
            else
               return resolve(new ServerError(ERRORS.CITY_CODE_NOT_FOUND, "City name doesn't appear in the db. Adrress:" + address));
         })
         .catch((err) => {
            return reject(err);
         });
   });
}

/**
 * Return OK if response was good. 
 * Else if no results return {}
 * else if error return the error description
 * @param {google json response} payload 
 */
const checkRouteResults = (payload) => {
   let status = payload.status;
   let result = 'OK';
   switch (status) {
      case 'OK':
         return status
         break;
      case 'REQUEST_DENIED':
         result = "Google api denied the request";
         break;
      case 'NOT_FOUND':
         result = "";
         break;
      case 'ZERO_RESULTS':
         result = "";
         break;
      default:
         result = "Google api denied the request: " + status;
         break;
   }
   return result;
}

const getRoutes = async (origin, destination, time) => {
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
      modeList.forEach((mode, index, array) => {
         params = `origin=${originAddr}&destination=${destinationAddr}&mode=${mode}&language=iw&departure_time=${time}&alternatives=true&key=${key}`
         url = `https://maps.googleapis.com/maps/api/directions/json?${params}`;
         promiseList.push(axios.get(url));
      });
      let suggestedRoutes = {};
      Promise.all(promiseList)
         .then((routesResponeList) => {
            suggestedRoutes = {};
            routesResponeList.forEach((res, index, array) => {
               let result = checkRouteResults(res.data);
               if (result === 'OK') {
                  suggestedRoutes[modeList[index]] = res.data.routes;
               }
               else if (result === "") {
                  suggestedRoutes[modeList[index]] = { error: "לא נמצא מסלול" };
               }
               else {
                  suggestedRoutes[modeList[index]] = { error: "שגיאה במערכת. לא ניתן לחשב מסלול - " + result };
                  logger.error(result);
               }
            });
            return resolve(suggestedRoutes);

         }).catch((error) => {
            logger.error(error.stack);
            modeList.forEach((mode, index, array) => {
               suggestedRoutes[mode] = { error: "שגיאה במערכת. לא ניתן לחשב מסלול" };
            });
            resolve(suggestedRoutes);
         });
   });
}

module.exports = { convertLocation, findLocality, getRoutes };