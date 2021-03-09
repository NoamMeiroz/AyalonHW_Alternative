const moment = require("moment-timezone");
const { createLogger, format, transports } = require("winston");
const appRoot = require('app-root-path');
var path = require('path')
var PROJECT_ROOT = path.join(__dirname, '..')

/** log  */
const appendTimestamp = format((info, opts) => {
   if (opts.tz)
      info.timestamp = moment.tz(opts.tz).format();
   return info;
});

/** log  */
const appendLines = format((info, opts) => {
   info.line = formatLogArguments();
   return info;
});



const options = {
   error: {
      level: 'error',
      filename: `${appRoot}/logs/cluster_error.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
   },
   combine: {
      level: 'info',
      filename: `${appRoot}/logs/cluster_combine.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
   },
   console: {
      /*format: format.combine(format.colorize(),
        format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}: ${message}]`})),*/
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true
   },
};

var logger = createLogger({
   format: format.combine(
      appendTimestamp({ tz: "Asia/Jerusalem" }),
      appendLines(),
      format.json()),
   transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new transports.File(options.error),
      new transports.File(options.combine),
   ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
   logger.add(new transports.Console(options.console));
}

class ServerError extends Error {
   constructor(status = 500, message = "error", ...params) {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super(...params);

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, ServerError);
      }

      this.name = 'ServerError';
      // Custom debugging information
      this.status = status;
      this.message = message;
      this.code = formatLogArguments(this.stack);
   }

}

/**
 * Attempts to add file and line number info to the given log arguments.
 */
function formatLogArguments(stack) {
   var stackInfo = getStackInfo(stack)
   if (stackInfo)
      return stackInfo.relativePath + ":" + stackInfo.line + ":" + stackInfo.pos;
   else
      return 
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo(stack) {
   // get call stack, and analyze it
   // get all file, method, and line numbers
   var stacklist = []
   var temp = {}
   if (stack) {
      stacklist = stack.split('\n').slice(3);
   }
   else
      stacklist = (new Error()).stack.split('\n').slice(3);

   // stack trace format:
   // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
   // do not remove the regex expresses to outside of this method (due to a BUG in node.js)

   var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
   var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi
   var stackReg3 = /at\s\/+(.*):(\d*):(\d*)/gi
   var sp = {}

   var finished = false;
   for (let index = 0; index < stacklist.length && !finished; index++) {
      s = stacklist[index];
      sp = stackReg.exec(s) || stackReg2.exec(s) || stackReg3.exec(s);
      if (sp && sp[2].match(/node_modules/gi) === null && sp[2].match(/internal/gi) === null
         && sp[2].match(/log.js/gi) === null)
         finished = true;
   }
   let result = {};
   if (!sp)
      return null;
   if (sp.length === 5) {
      result = {
         method: sp[1],
         relativePath: path.relative(PROJECT_ROOT, sp[2]),
         line: sp[3],
         pos: sp[4],
         file: path.basename(sp[2]),
         stack: stacklist.join('\n')
      }
   }
   else if (sp.length === 4) {
      result = {
         method: sp[0],
         relativePath: path.relative(PROJECT_ROOT, sp[1]),
         line: sp[2],
         pos: sp[3],
         file: path.basename(sp[1]),
         stack: stacklist.join('\n')
      }
   }
   return result;
}

module.exports = { ServerError, logger };