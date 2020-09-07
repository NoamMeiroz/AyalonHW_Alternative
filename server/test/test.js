require('dotenv').config();

var companyData = require('./companyData');
var db = require('./dbConnection');
var assert = require('assert');

describe('Project tests', function () {
  describe('dbConnection', db.bind(this));
  describe('companyData', companyData.bind(this));
});

