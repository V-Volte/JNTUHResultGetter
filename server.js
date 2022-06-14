let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let request = require('request');
const { exec } = require('child_process');
var fs = require('fs');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    let data = req.body;
    console.log("data=" + data);
    console.log(typeof(data));
    let command = "python test.py " + data.htno;
    let url = "http://results.jntuh.ac.in/resultAction";
    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.send(error);
        }
        if (stderr) {
            res.send(stderr);
        } else {
            let x = fs.readFile('./reqtab.json', 'utf8', (err, data) => {
                if (err) {
                    res.send(err);
                }
                res.setHeader('Content-Type', 'application/json');
                console.log(data);
                res.send(data);

            });

        };

    });

});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + "/script.js");
});


app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + "/style.css");
});

app.listen(6969);