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

        try {


            console.log('SPAWNING!');
            // console.log(Object.keys(JSON.parse(JSON.stringify(sample_data))).length);

            

            const pythonProcess = spawn('python',["clustering.py",JSON.stringify(sample_data)]);
            
            

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
                
            })

/*             pythonProcess.on("exit",(code,signal)=> {
                console.log(code);
                console.log(signal);
            }); */
    

        }

        catch (error) {
            res.status(500).send(error);
            console.log(error);
        };

   

});

const PORT = 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
