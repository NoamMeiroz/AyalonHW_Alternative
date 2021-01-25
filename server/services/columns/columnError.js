const ERROR_CODES = {
   UNKOWN_ERROR: 0,
   NULL_ERROR: 1,
   TYPE_ERROR: 2,
   INPUT_ERROR: 3
};

class ColumnError extends Error {
    constructor(status = UNKOWN_ERROR, message = "error", ...params) {
       // Pass remaining arguments (including vendor specific ones) to parent constructor
       super(...params);
 
       // Maintains proper stack trace for where our error was thrown (only available on V8)
       if (Error.captureStackTrace) {
          Error.captureStackTrace(this, ColumnError);
       }
 
       this.name = 'ColumnError';
       // Custom debugging information
       this.status = status;
       this.message = message;
    }
 
 }

 module.exports = { ColumnError, ERROR_CODES }