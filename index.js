const express = require('express');
require('dotenv').config();
const app = express();
const { getData } = require('./src/getData');

app.use(express.static('public'));
// app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    const ID = "PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p";

    getData(ID);
})
app.listen(process.env.PORT, (req, res) => {
    console.log("listening on port " + process.env.PORT);
})