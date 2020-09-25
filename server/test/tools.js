var chai = require("chai");
var expect = chai.expect;
var tools = require('../tools');
const { performance } = require('perf_hooks');

const test = function suite() {
    describe("Testing tools functions", function (done) {
        describe("getFirstNumberInString", function (done) {
            it("getFirstNumberInString return first numbers", function () {
                expect(tools.getFirstNumberInString("34")).to.be.eq("34");
                expect(tools.getFirstNumberInString("34a")).to.be.eq("34");
                expect(tools.getFirstNumberInString("34\5")).to.be.eq("34");
                expect(tools.getFirstNumberInString("34 א")).to.be.eq("34");
            });

            it("getFirstNumberInString return null", function () {
                expect(tools.getFirstNumberInString("g34")).to.be.null;
                expect(tools.getFirstNumberInString("dk of")).to.be.null;
            });
        });
    });

}
module.exports = test;