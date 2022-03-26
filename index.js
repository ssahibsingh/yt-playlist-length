const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const { getTime } = require('./src/getTime')
const { getData } = require('./src/getData')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var error = "";
app.get('/', (req, res) => {
    res.render('index', { error: error, totalVideos: "", videoLen: "" });
})

app.post('/', (req, res) => {
    var url = req.body.url;
    const ID = url.slice(38, url.length);
    var start, end;
    if (req.body.start && req.body.end) {
        if (req.body.start) {
            start = req.body.start;
        }
        if (req.body.end) {
            end = req.body.end;
        }
    }
    else if (req.body.start) {
        error = "Please enter 'To' Field";
        res.render('index', { error: error, totalVideos: "", videoLen: "" });
    }
    else if (req.body.end) {
        error = "Please enter 'From' Field";
        res.render('index', { error: error, totalVideos: "", videoLen: "" });
    }

    (async () => {
        let [totalV, Videos] = await getData(ID);
        if (!(start || end)) {
            start = 0;
            end = Videos.length - 1;
        }
        else {
            start = start - 1;
            if (end == totalV) {
                end = end - 1;
            }
        }
        let Time = await getTime(Videos, start, end);
        res.render('index', { error: error, totalVideos: totalV, videoLen: Time });
    })();

})


app.listen(process.env.PORT, (req, res) => {
    console.log("listening on port " + process.env.PORT);
})