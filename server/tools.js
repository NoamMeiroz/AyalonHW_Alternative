function isInteger(id) {
   if (parseInt(id))
      return true;
   else
      return false;
};

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

function getNearestWorkDay(date) {
   let now = new Date();
   now.setDate(date.getDate() + 1)
   now.setHours(8);
   now.setMinutes(0);
   now.setMilliseconds(0);
   if (now.getDay() >= 5)
      return getNearestWorkDay(now);
   else
      return (Math.floor(now.getTime() / 1000));
}

module.exports = { isInteger, sleep, getNearestWorkDay }; 