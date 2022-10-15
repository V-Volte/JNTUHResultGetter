let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let request = require('request');
const { exec } = require('child_process');
var fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

function getResults(htno, callback) {
    let pprocess = spawn('python', ['test.py', htno])
    console.log(`Spawning process 'python test.py ${htno}'`)
    pprocess.stdout.on('data', (data) => {
        // if (err) res.send(err);
        // res.setHeader('Content-Type', 'application/json');
        // console.log(data);
        callback(data);
    })
}

const port = process.env.PORT || 5000;
app.use('/', express.static(__dirname))
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    let data = req.body;
    // console.log("data=" + data);
    // console.log(typeof(data));
    console.log(data.htno);
    getResults(data.htno, (sdata) => {
        res.setHeader('Content-Type', 'application/json');
        console.log(sdata);
        res.send(sdata);
    })

    // let command = "python test.py " + data.htno;
    // let url = "http://results.jntuh.ac.in/resultAction";
    // exec(command, (error, stdout, stderr) => {
    //     if (error) {
    //         res.send(error);
    //     } else if (stderr) {
    //         res.send(stderr);
    //     } else {

    //         let x = fs.readFile('./reqtab.json', 'utf8', (err, data) => {
    //             if (err) {
    //                 res.send(err);
    //             }
    //             res.setHeader('Content-Type', 'application/json');
    //             console.log(data);
    //             res.send(data);

    //         });

    //     };

    // });

});

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + "/index.html"));
// });

// app.get('/script.js', (req, res) => {
//     res.sendFile(path.join(__dirname + "/script.js"));
// });

// app.get('/favicon.ico', (req, res) => {
//     res.sendFile(path.join(__dirname + '/favicon.ico'));
// });

// app.get('/style.css', (req, res) => {
//     res.sendFile(path.join(__dirname + "/style.css"));
// });

app.listen(port, () => {
    console.log("Server started at port " + port);
});