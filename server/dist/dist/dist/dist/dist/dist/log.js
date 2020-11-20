"use strict";

const moment = require("moment-timezone");

const {
  createLogger,
  format,
  transports
} = require("winston");

const appRoot = require('app-root-path');
/** log  */


const appendTimestamp = format((info, opts) => {
  if (opts.tz) info.timestamp = moment.tz(opts.tz).format();
  return info;
});
const options = {
  error: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    // 5MB
    maxFiles: 5,
    colorize: false
  },
  combine: {
    level: 'info',
    filename: `${appRoot}/logs/combine.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    /*format: format.combine(format.colorize(),
      format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}: ${message}]`})),*/
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true
  }
};
var logger = createLogger({
  format: format.combine(appendTimestamp({
    tz: "Asia/Jerusalem"
  }), format.json()),
  transports: [//
  // - Write all logs with level `error` and below to `error.log`
  // - Write all logs with level `info` and below to `combined.log`
  //
  new transports.File(options.error), new transports.File(options.combine)]
}); //
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console(options.console));
}

class ServerError extends Error {
  constructor(status = 500, message = "error", ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params); // Maintains proper stack trace for where our error was thrown (only available on V8)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError);
    }

    this.name = 'ServerError'; // Custom debugging information

    this.status = status;
    this.message = message;
  }

}

module.exports = {
  ServerError,
  logger
};