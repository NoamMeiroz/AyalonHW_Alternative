var chai = require("chai");
var expect = chai.expect;
var db = require('../db/database');
var { ServerError } = require('../log');
const { assert } = require("chai");


const test = function suite() {
    describe("Testing db connection", function (done) {
        it("Connection to db is successful", async function () {
            await db.sequelize.authenticate()
            .then(()=>done())
            .catch(err => assert("Failed to connect to the db"));

        });
    });
}
module.exports = test;