import ExcelJS from 'exceljs';

/**
 * 	read all sheets and return an object with all data
 *	each sheet is a property
 * @param {*} file - xlsx file
 */
export const load_data = async (file) => {
	const workbook = new ExcelJS.Workbook();
	let wb = await workbook.xlsx.load(file);
	let data = {};

	wb.eachSheet(function(worksheet, sheetId) {
		let keys = [];
		let sheet = [];
		worksheet.eachRow((row, rowNumber) => {
			let currRow = {};
			if (rowNumber===1) {
				sheet = [];
				keys = row.values
			}
			else {
				keys.forEach((key, index, array)=>{
					currRow[key]=row.values[index];
				});
				sheet.push(currRow);
			}
		});
		data[worksheet.name] = sheet;
	  });
	return data;
}

