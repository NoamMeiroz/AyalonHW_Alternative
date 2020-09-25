require('dotenv').config();

var companyData = require('./companyData');
var db = require('./dbConnection');
var tools = require('./tools');

describe('Project tests', function () {
  describe('dbConnection', db.bind(this));
  describe('companyData', companyData.bind(this));
  describe('tools', tools.bind(this));

});

