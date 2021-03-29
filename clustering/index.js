const express = require('express');
const spawn = require("child_process").spawn;
var bodyParser = require('body-parser');
const {performance} = require('perf_hooks');
const { logger, ServerError } = require('./log');

const app = express();

// use middleware
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// curl request
// curl -X POST --header "Content-Type: Application/json" localhost:3000 -d '{"name":"Amit"}'

app.post('/', (req,res) => {
        // parse request body
        var sample_data = req.body;
        var script_output = [];
        var start = performance.now();
        logger.info("Start cluster calculation");
        try {
            const pythonProcess = spawn('python',["clustering.py",JSON.stringify(sample_data)]);
            var length = sample_data.employees.length;

            pythonProcess.stdout.on('data',(data)=>{
                script_output.push(data);
            });

            pythonProcess.on("close",(code)=>{
                let end = performance.now();
                logger.info(`Number of employees: ${length}, Execution time: ${end - start} ms`);
                let response = {};
                let resCode = 200;
                if(code==0) {
                    // try to parse return result to valid json (list of employees)
                    try {
                        let result = script_output+"";
                        let index = result.lastIndexOf('],');
                        if (index!==-1)
                            result = result.slice(0, (index+1));
                        response = JSON.parse(result);
                        if (response.code !==undefined) {
                            resCode = 400;
                        }
                        logger.info(response);
                    }
                    // catch error of the parse. This means the return result is an error string
                    catch(error) {
                        logger.error(script_output+"");
                        resCode = 500;  
                        logger.error(error.stack);
                        response = {code: "4000", message: "Unknown error"};
                    }
                    res.status(resCode).json(response);
                }
                else {
                    res.status(500).send("Error!");
                }
                
            });
        }
        catch (error) {
            res.status(500).send(error);
            logger.error(error.stack);
        };

   

});

const PORT = 3000;

var server = app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
