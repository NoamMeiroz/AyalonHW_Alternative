var XLSX = require('xlsx');
const { logger, ServerError } = require('../log');

/**
 * 	read all sheets and return an object with all data
 *	each sheet is a property
 * @param {*} file - xlsx file
 */
const load_data = (file) => {
	let workbook = XLSX.readFile(file);
	let data = {};

	for (let i = 0; i < workbook.SheetNames.length; ++i) {
		let sheet = workbook.Sheets[workbook.SheetNames[i]];
		let temp = XLSX.utils.sheet_to_json(sheet);
		data[workbook.SheetNames[i]] = temp;
	}
	return data;
}

const post_data = (req, res) => {
	let files = {};
	if (req.files) {
		files = req.files;
	}
	else if (req.fields) {
		files = { "file": req.fields.file };
	}
	else
		throw new ServerError(400, "No file attached");
	let keys = Object.keys(files), k = keys[0];
	let data = load_data(files[k].path);
	return data;
}

const post_file = (req, res, file) => {
	let data;
	if (file) {
		data = load_data(file);
	}
	else {
		data = post_data(req, res)
	}
	return data;
}

module.exports = { post_file };