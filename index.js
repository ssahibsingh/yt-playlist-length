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
    if (url.length < 38 && url.slice(0, 38) != "https://www.youtube.com/playlist?list=") {
        error = "Enter correct URL";
        res.render('index', { error: error, totalVideos: "", videoLen: "" });

    }
    else {

        const ID = url.slice(38, url.length);
        // console.log(url);

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
            if(start<=end){
                let Time = await getTime(Videos, start, end);
                if (!Time) {
                    res.render('index', { error: "Something went Wrong!!!", totalVideos: "", videoLen: "" });
                }
                res.render('index', { error: error, totalVideos: totalV, videoLen: Time });
            }
            else{
                res.render('index', { error: "Incorrect Input for Range", totalVideos:"", videoLen: "" });
            }
        })();
    }

})


app.listen(process.env.PORT, (req, res) => {
    console.log("listening on port " + process.env.PORT);
})