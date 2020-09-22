export function timeConvert(num) {
   var hours = Math.floor(num / 60);
   var minutes = num % 60;
   if (minutes < 10)
      minutes = "0" + minutes;
   return hours + ":" + minutes;
}