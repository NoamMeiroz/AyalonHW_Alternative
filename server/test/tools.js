var chai = require("chai");
var expect = chai.expect;
var should = chai.should();
var tools = require('../tools');
const { performance } = require('perf_hooks');
const { assert } = require("chai");


const test = function suite() {
    describe("Testing tools functions", function () {

        describe("isInteger", function () {
            it("tests", function () {
                expect(tools.isInteger(34)).to.be.true;
                expect(tools.isInteger('34')).to.be.true;
                expect(tools.isInteger(34.5)).to.be.false;
                expect(tools.isInteger('3k')).to.be.false;
                expect(tools.isInteger(null)).to.be.false;
                expect(tools.isInteger(undefined)).to.be.false;

            });
        });

        describe("getFirstNumberInString", function () {
            it("getFirstNumberInString return first numbers", function () {
                expect(tools.getFirstNumberInString(34)).to.be.eq(34);
                expect(tools.getFirstNumberInString("34")).to.be.eq(34);
                expect(tools.getFirstNumberInString("34a")).to.be.eq(34);
                expect(tools.getFirstNumberInString("34\5")).to.be.eq(34);
                expect(tools.getFirstNumberInString("34 א")).to.be.eq(34);
            });

            it("getFirstNumberInString return null", function () {
                expect(tools.getFirstNumberInString(null)).to.be.null;
                expect(tools.getFirstNumberInString(34.5)).to.be.null;
                expect(tools.getFirstNumberInString("g34")).to.be.null;
                expect(tools.getFirstNumberInString("dk of")).to.be.null;
            });

        });

        describe("sleep", function () {
            it("sleep return after 2 seconds", async function () {
                this.timeout(3000);
                start = performance.now();
                await tools.sleep(2000);
                end = performance.now();
                expect(end - start).be.gte(1999);
            });
        });
    });

}
module.exports = test;