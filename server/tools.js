/**
 * If input is integer return true
 * @param {*} id 
 */
function isInteger(id) {
   if (parseInt(id))
      return true;
   else
      return false;
};

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

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
   if (!alphanum || isInteger(alphanum))
      return numbers;

   firstChar = (alphanum.match(/[^0-9]/) || []).pop();
   if (!firstChar)
      if (isInteger(alphanum))
         numbers = alphanum;
      else
         numbers = null;
   else {
      if ( alphanum.search(firstChar) === 0 )
         numbers = null;
      else {
         numsLetters = alphanum.split(firstChar);
         numbers = numsLetters[0];
      }
   }
   return numbers;
}

module.exports = { isInteger, sleep, getNearestWorkDay, getFirstNumberInString }; 