const express = require('express');
const spawn = require("child_process").spawn;
var bodyParser = require('body-parser');

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



    
        // var sample_data = JSON.stringify(req.body);
        //var sample_data = {name:'Jonathan'};
        console.log(sample_data);
        try {
            console.log(!JSON.stringify(sample_data).replace(/\s/g, '').length);
            // send 204 HTTP response
            if (!JSON.stringify(sample_data).replace(/\s/g, '').length) {
                res.status(204).send("The server successfully processed the request, and is not returning any content");
            }
            else if (Object.keys(JSON.parse(JSON.stringify(sample_data))).length < 1) {
                res.status(204).send("The server successfully processed the request, and is not returning any content");

            }
            else {

            console.log('SPAWNING!');
            console.log(Object.keys(JSON.parse(JSON.stringify(sample_data))).length);

            

            const pythonProcess = spawn(`C:\\Users\\jonat\\Anaconda3\\python.exe`,["clustering.py",JSON.stringify(sample_data)]);
            
            

            pythonProcess.stdout.on('data',(data)=>{

                script_output.push(data);
                console.log(`Python output is ${data}`);

            });

            pythonProcess.on("close",(code)=>{
                console.log(code);
                if(code==0) {
                    res_close = JSON.parse(script_output+"");
                    res.status(200).json(res_close);
                }
                else {
                    res.status(500).send("Error!");
                }
                
            });

/*             pythonProcess.on("exit",(code,signal)=> {
                console.log(code);
                console.log(signal);
            }); */
    

        }}

        catch (error) {
            res.status(500).send(error);
            console.log(error);
        };

   

});

const PORT = 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
