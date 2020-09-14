const axios = require('axios');
const proj4 = require('proj4');
const { ServerError } = require('../log');

const ERRORS = {
    INVALID_ADDRESS_CODE: 1000,
    MISSING_CITY_CODE: 1001,
    MISSING_STREET_CODE: 1002,
    MISSING_BUILDING_NUMBER_CODE: 1003
};


function convertCoordinate(location) {
    const secondProjection = "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs";
    const y = location["lat"];
    const x = location["lng"];
    const converted_xy = proj4(proj4.defs["EPSG:4326"], secondProjection, [x, y]);
    const result = { X: converted_xy[0], Y: converted_xy[1] };
    return result;
}

checkResults = (payload) => {
    let status = payload.status;
    let result = null;
    console.log(JSON.stringify(payload));
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
}

getCoordinates = (payload) => {
    let location = [];
    let result = {};
    if (payload.results) {
        if ((payload.results.length > 0) &&
            (payload.results[0].types[0] === "street_address"))
            if (payload.results[0].geometry) {
                location = payload.results[0].geometry.location;
                if (location) {
                    result = convertCoordinate(location);
                }
                else
                    result = new ServerError(500, "Google api is different then expected.");
            }
            else
                result = new ServerError(500, "Google api is different then expected.");
        else
            result = new ServerError(ERRORS.INVALID_ADDRESS_CODE, "Invalid address");
    }
    else
        result = new ServerError(500, "Google api is different then expected.");
    return result;
}

const convertLocation = (city, street, buildingNumber) => {
    return new Promise(function (resolve, reject) {
        if (!city) {
            return resolve(new ServerError(ERRORS.MISSING_CITY_CODE, "missing city"));
        }
        if (!street){
            return resolve(new ServerError(ERRORS.MISSING_STREET_CODE, "missing street"));
        }
        if (!buildingNumber){
            return resolve(new ServerError(ERRORS.MISSING_BUILDING_NUMBER_CODE, "missing building number"));
        }

        let address = street + buildingNumber + ", " + city;
        address = encodeURI(address);
        let key = process.env.GOOGLE_API_KEY;
        url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=iw&key=${key}`;
        axios.get(url)
            .then((res) => {
                let result = checkResults(res.data);
                if (result instanceof ServerError)
                    return reject(result)
                else {
                    result = getCoordinates(res.data);
                    resolve(result);
                }

            }).catch((err) => {
                reject(err);
            });
    });
}

module.exports = { convertLocation, ERRORS };