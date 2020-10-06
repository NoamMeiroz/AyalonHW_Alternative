export function timeConvert(num, unit = "דקות", about = false) {
   let smallSingleText = 'דקה';
   let smallText = 'דקות';
   let highSingleText = 'שעה';
   let hightText = 'שעות';
   if (unit === "שניות") {
      smallSingleText = 'שניה';
      smallText = 'שניות';
      highSingleText = 'דקה';
      hightText = 'דקות';
   }
   let highUnit = 0;
   let smallUnit = 0;
   if (about) {
      highUnit = Math.floor(num / 60)+1;
      smallUnit = 0;
   }
   else {
      highUnit = Math.floor(num / 60);
      smallUnit = num % 60;
   }

   if (smallUnit === 1)
      smallUnit = smallSingleText;
   else if (smallUnit !== 0)
      smallUnit = `${smallUnit} ${smallText}`;
   if (highUnit === 0)
      return smallUnit;
   else if (highUnit === 1)
      highUnit = `${highSingleText} אחת`
   else
      highUnit = `${highUnit} ${hightText}`;
   if (smallUnit === 0)
      return highUnit;
   else
      return `${highUnit} ו-${smallUnit}`;
}