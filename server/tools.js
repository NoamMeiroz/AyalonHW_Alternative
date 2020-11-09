/**
 * If input string or number is integer return true
 * @param {*} id 
 */
function isInteger(id) {
   if (!id)
      return false;
   if (Number.isInteger(id))
      return true;
   return Number.isInteger(Number(id));
};

/**
 * return the closest work day for a given date.
 * Will return sunday if date is thursday.
 * @param {Date} date 
 */
function getNearestWorkDay(date) {
   let now = new Date();
   now.setDate(date.getDate() + 1)
   now.setHours(8);
   now.setMinutes(0);
   now.setMilliseconds(0);
   if (now.getDay() >= 5)
      return getNearestWorkDay(now);
   else {
      return (Math.floor(now.getTime() / 1000));
   }
}

/**
 * Return the first digits of a string. 
 * Any non digit characters are truncated.
 * Return null if string start with non digit or no digits at all.
 * @param {string} alphanum 
 */
function getFirstNumberInString(alphanum) {
   //firstChar=alphanum.match(/[a-zA-Z]/).pop();
   let numbers = null;
   if (!alphanum)
      return alphanum;

   if (!(typeof alphanum === 'string' || alphanum instanceof String)) {
      if (isInteger(alphanum))
         return (alphanum)
      else
         return null;
   }
   firstChar = (alphanum.match(/[^0-9]/) || []).pop();
   if (!firstChar) {
      numbers = Number(alphanum);
      if (!isInteger(numbers))
         numbers = null;
   }
   else {
      if (alphanum.search(firstChar) === 0)
         numbers = null;
      else {
         numsLetters = alphanum.split(firstChar);
         numbers = Number(numsLetters[0]);
      }
   }
   return numbers;
}

function sleep(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Return list of string from a given string with dalimiter ','.
 * If input in null or not string or empty string then return null.
 * @param {} str 
 */
function convertStringToArray(str) {
   let result = null;
   if (str && str !== '' && str!=='null') {
      try {
         result = str.split(",");
      }
      catch (error) {
         console.debug(error);
         result = null;
      }
   }
   return result;
}


module.exports = { isInteger, getNearestWorkDay, getFirstNumberInString, sleep, convertStringToArray }; 