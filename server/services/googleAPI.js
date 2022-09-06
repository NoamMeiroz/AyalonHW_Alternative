const axios = require('axios');
const proj4 = require('proj4');
const { ServerError, logger } = require('../log');
const localityService = require('./data/localityData');
const { ERRORS } = require("./ERRORS");
const { findFastestRoute } = require('./route');
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
         if (streetParam === cityParam )
            address = `ישוב ${cityParam}`;
         else
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
         return resolve({ error: "לא ניתן לחשב מסלול. נתוני ישוב מגורים חסרים"});
      }
      if (!destination) {
         return resolve({ error: "לא ניתן לחשב מסלול. נתוני יעד חסרים"});
      }
      if (!origin.city) {
         return resolve({ error: "לא ניתן לחשב מסלול. שם ישוב מקום המגורים חסר."});
      }
      if (!origin.street) {
         return resolve({ error: "לא ניתן לחשב מסלול. שם הרחוב במקום המגורים חסר."});
      }
      if (origin.buildingNumber === null) {
         return resolve({ error: "לא ניתן לחשב מסלול. מספר בניין חסר במקום המגורים."});
      }
      if (!destination.city) {
         return resolve({ error: "לא ניתן לחשב מסלול. שם ישוב מקום העבודה חסר."});
      }
      if (!destination.street) {
         return resolve({ error: "לא ניתן לחשב מסלול. שם הרחוב במקום העבודה חסר."});
      }
      if (destination.buildingNumber === null) {
         return resolve({ error: "לא ניתן לחשב מסלול. מספר בניין חסר במקום העבודה."});
      }
      let originAddr = "";
      if (origin.buildingNumber === 0)
         if (origin.street === origin.city)
            originAddr = `ישוב ${origin.city}`;
         else
            originAddr = origin.street + ", " + origin.city;
      else
         originAddr = origin.street + " " + origin.buildingNumber + ", " + origin.city;
      originAddr = encodeURI(originAddr);

      let destinationAddr = "";
      if (destination.buildingNumber === 0)
         if (destination.street === destination.city)
            destinationAddr = `ישוב ${destination.city}`;
         else
            destinationAddr = destination.street + ", " + destination.city;
      else
         destinationAddr = destination.street + " " + destination.buildingNumber + ", " + destination.city;
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
                  suggestedRoutes[modeList[index]] = findFastestRoute(res.data.routes);
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