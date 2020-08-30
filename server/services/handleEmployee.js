const { workerData, parentPort } = require('worker_threads')
const employeeSchema = require('../db/employeeSchema');
const employee = require('../models/employee');
const empFields = require("../config/config").employeeFieldsName;
const siteFields = require("../config/config").sitesFieldsName;


const employer = workerData.employer;
var employeeList = workerData.employees;

employeeList = employeeList.map((emp)=>{
    let employee = {
        EMPLOYER_ID: employer.id,
        WORKER_ID: emp[empFields.WORKER_ID],
        CITY: emp[empFields.CITY],
        STREET: emp[empFields.STREET],
        BUILDING_NUMBER: emp[empFields.BUILDING_NUMBER]
    }
    site = employer.Sites.filter((site)=>{
        return (site.NAME===emp[siteFields.NAME])
    })
    employee.WORK_SITE = site[0].id; 
    return employee;
});
employeeSchema.insertBulk(employeeList, (err, data)=>{
    if (err)
        throw err;
    let empList = data.map((employee)=>{
            return employee.dataValues;
    });
    parentPort.postMessage({ Employees: empList });
});

/**
 * This is a script to replace an adress of each employee with Gush and
 * find his best way to get home.
 */
/*for (employee of workerData) {
    console.log(employee);
}
/*
const data ={
    type: 0,
    adress: "לינקולן 1 תל אביב"
};

const authOptions = {
    hostname: 'ags.govmap.gov.il',  
    path: '/Api/Controllers/GovmapApi/Auth',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};


const axios = require('axios');
const { response } = require('express');
axios.post('https://ags.govmap.gov.il/Api/Controllers/GovmapApi/SearchAndLocate', data)
    .then((res) => {
        console.log(`Status: ${res.status}`);
        console.log('Body: ', res.data);
        console.log(res);
    }).catch((err) => {
        console.error(err);
    });
*/
