require('dotenv').config();

const chai = require("chai");
const expect = chai.expect;
const db = require('../db/database');
const mysql2 = require('mysql2');
const company_data = require('../services/companyData');
const { ServerError } = require('../log');
const { assert } = require("chai");
const { resolve } = require("app-root-path");
const { logger } = require('../log');

const test = function suite() {

    describe("Testing companyData service", function () {
        var excel = {};
        var pool = {};
        var getConnection = null;

        after(function () {
            sql = "DELETE FROM employers WHERE NAME='חברת בדיקות'";
            getConnection(sql, (err, results, fields) => {
                pool.end();
            });
        });

        before(function () {

            // synchronize with database
            db.sequelize
                .authenticate()
                .then(() => {
                    logger.info('Connection has been established successfully.');
                })
                .catch(err => {
                    logger.error('Unable to connect to the database: ' + err);
                    process.exit(1);
                });


            pool = mysql2.createPool({
                connectionLimit: 100,
                host: '127.0.0.1',
                port: 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: 'alternative'
            });

            getConnection = (sql, callback) => {
                pool.getConnection(function (err, conn) {
                    if (err) {
                        callback(err, null, null);
                    }
                    else {
                        conn.query(sql, null, (err, results, fields) => {
                            callback(err, results, fields);
                        });
                    }
                });
            };
        });

        beforeEach(function () {
            excel = {
                "פרטי חברה": [
                    {
                        "שם חברה": "חברת בדיקות",
                        "מגזר": "תחבורה",
                        "רכב צמוד": "כן",
                        "שאטלים": "לא",
                        "הסעות": "לא",
                        "Carpool": "לא",
                        "עבודה מהבית": "כן"
                    }
                ],
                "פרטי עובדים": [
                    {
                        "מזהה עובד": "1",
                        "עיר מגורים": "תל אביב",
                        "רחוב": "ויצמן",
                        "מספר בניין": "2",
                        "שם אתר": "מטה",
                        "כתובת עבודה-עיר": "תל אביב",
                        "כתובת עבודה-רחוב": "הברזל",
                        "כתובת עבודה-מספר בניין": "5"
                    }
                ]
            }
        });

        describe("readSheet company data validation tests", function () {
            it("Handle invalid input by throwing ServerError", async function () {
                await company_data.readSheet()
                    .catch(err => expect(err).to.be.an.instanceOf(ServerError));

                await company_data.readSheet({})
                    .catch(err => expect(err).to.be.an.instanceOf(ServerError));

                await company_data.readSheet([])
                    .catch(err => expect(err).to.be.an.instanceOf(ServerError));
            });

            it("Handle missing company sheet", async function () {
                await company_data.readSheet({ "פרטי חברה": [0, 2] })
                    .catch(err => expect(err).to.be.an.instanceOf(ServerError));


                await company_data.readSheet({ "פרטי חברה": { "0": {} } })
                    .catch(err => expect(err).to.be.an.instanceOf(ServerError));


                await company_data.readSheet([{ "פרטי עובדים": [0] }])
                    .catch(err => expect(err).to.be.an.instanceOf(ServerError));
            });

            it("company sheet must include Carpool", async function () {
                delete excel["פרטי חברה"][0]["Carpool"];
                await company_data.readSheet(excel)
                    .then(data => assert.fail(data, "ServerError", "Should be thrown a ServerError"))
                    .catch(err => {
                        expect(err).to.be.an.instanceOf(ServerError);
                        expect(err.message).to.be.eq("פרטי החברה לא כוללים נתוני Carpool");
                    });
            });
        });

        describe("readSheet employee data validation tests", function () {

            it("employee data must include list of employees", async function () {
                delete excel["פרטי עובדים"];
                await company_data.readSheet(excel)
                    .then(data => assert.fail(data, "ServerError", "Should be thrown a ServerError"))
                    .catch(err => {
                        expect(err).to.be.an.instanceOf(ServerError);
                        expect(err.message).to.be.eq("חוצץ פרטי עובדים חסר");
                    });
            });

            it("employee data must include list of employees", async function () {
                delete excel["פרטי עובדים"][0];
                await company_data.readSheet(excel)
                    .then(data => assert.fail(data, "ServerError", "Should be thrown a ServerError"))
                    .catch(err => {
                        expect(err).to.be.an.instanceOf(ServerError);
                        expect(err.message).to.be.eq("חוצץ פרטי עובדים אינו מכיל מידע על העובדים");
                    });
            });

            it("employee data must include שם אתר", async function () {
                delete excel["פרטי עובדים"][0]["שם אתר"];
                await company_data.readSheet(excel)
                    .then(data => assert.fail(data, "ServerError", "Should be thrown a ServerError"))
                    .catch(err => {
                        expect(err).to.be.an.instanceOf(ServerError);
                        expect(err.message).to.be.eq("פרטי עובדים לא כוללים  שם אתר");
                    });
            });
        });

        /**        describe("Check insert", function () {

            it("Check employer", function (done) {
                let sql1 = "select count(*) as 'exists' from employers e where e.name = 'חברת בדיקות'";

                let sql2 = "select count(*) as 'exists' from employers_sites, " +
                    "employers as e where e.name = 'חברת בדיקות' and employer_id=e.id";

                let sql3 = "select count(*) as 'exists' from employees, " +
                    "employers as e where e.name = 'חברת בדיקות' and employer_id=e.id";

                company_data.readSheet(excel)
                    .then(data => {
                        // employers table
                        getConnection(sql1, function (err, results, fields) {
                            if (err)
                                done(err);
                            else
                                if (results[0]['exists'] === 1) {
                                    // sites table
                                    getConnection(sql2, function (err, results, fields) {
                                        if (err)
                                            done(err);
                                        else
                                            if (results[0]['exists'] === 1) {
                                                done();
                                            }
                                            else
                                                done("Sector is not saved in the db");
                                    });
                                }
                                else
                                    done("Employer is not saved in the db");
                        });
                    })
                    .catch(err => {
                        done(err);
                    });

            });

        });
        */
    });
}
module.exports = test;
