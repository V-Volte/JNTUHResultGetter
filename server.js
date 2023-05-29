let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const scraper = require(__dirname + '/resultgetter.js')

const port = process.env.PORT || 5000;
app.use('/', express.static(__dirname + '/static'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((err, req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(404);
    res.send(JSON.stringify({
        status: 404,
        message: "Not Found"
    }, null, 4));
})

app.post('/', (req, res) => {
    let data = req.body;
    console.log(data.htno);
    try {
        scraper.getResults(data.htno, (sdata) => {
            res.setHeader('Content-Type', 'application/json');
            console.log(sdata);
            res.send(sdata);
        })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404);
        res.send(JSON.stringify({
            status: 404,
            message: "Not Found"
        }, null, 4));
    }

});

app.post('/all', async (req, res) => {
    let data = req.body;
    console.log(data.htno);

    try {
        let sdata = await scraper.getAllResults(data.htno);
        res.setHeader('Content-Type', 'application/json');
        console.log(sdata);
        res.send(sdata);
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404);
        res.send(JSON.stringify({
            status: 404,
            message: "Not Found",
            err: err
        }, null, 4));
    }

});

app.listen(port, () => {
    console.log("Server started at port " + port);
});