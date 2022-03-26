const express = require('express');
require('dotenv').config();
const app = express();

const {getTime} = require('./src/getTime')
const {getData} = require('./src/getData')

app.use(express.static('public'));
// app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    
    // const ID = "PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p";
    const ID = "PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ";
    
    (async () => {
        let Videos = await getData(ID);
        let Time = await getTime(Videos, 0, Videos.length - 1);
        console.log(Time);
    })();

})


app.listen(process.env.PORT, (req, res) => {
    console.log("listening on port " + process.env.PORT);
})