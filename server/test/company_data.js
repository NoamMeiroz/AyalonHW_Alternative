var expect = require('chai').expect;
var assert = require('assert');
var company_data = require('../services/company_data');
var {ServerError} = require('../log');

const test = function suite() {
    describe("Testing company_data service", function() {
        describe("saveSheet", function() {
            it("Handle invalid input by throwing ServerError", function() {
                expect(function(){
                    company_data.saveSheet();
                }).to.throw(ServerError);

                expect(function(){
                    company_data.saveSheet({});
                }).to.throw(ServerError);

                expect(function(){
                    company_data.saveSheet([]);
                }).to.throw(ServerError);
            });

            it("Handle missing company sheet", function() {
                expect(function(){
                    company_data.saveSheet({"פרטי חברה": [0,2]});
                }).to.throw(ServerError);

                expect(function(){
                    company_data.saveSheet({"פרטי חברה":{"0":{}}});
                }).to.throw(ServerError);


                expect(function(){
                    company_data.saveSheet([{"פרטי עובדים": [0]}]);
                }).to.throw(ServerError);
            });

            it("company sheet must include שם חברה,מגזר,רכב צמוד,שאטלים,הסעות, Carpool, עבודה מהבית", function() {
                expect(function(){
                    company_data.saveSheet({"פרטי חברה":
                        {"0":
                            {
                                "שם חברה": "איילון",
                                "מגזר":"תחבורה",
                                "רכב צמוד":"כן",
                                "שאטלים":"לא",
                                "הסעות":"לא",
                                "Carpool":"לא",
                                "עבודה מהבית":"כן"
                            }
                        }
                    });
                }).to.not.throw();

                
            });
        });
    });
}

module.exports = test;
