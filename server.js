let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const scraper = require(__dirname + '/resultgetter.js')

const port = process.env.PORT || 5000;
app.use('/', express.static(__dirname))
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    let data = req.body;
    console.log(data.htno);
    scraper.getResults(data.htno, (sdata) => {
        res.setHeader('Content-Type', 'application/json');
        console.log(sdata);
        res.send(sdata);
    })

});


app.listen(port, () => {
    console.log("Server started at port " + port);
});