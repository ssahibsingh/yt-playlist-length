const express = require('express');
const axios = require('axios');
require('dotenv').config();

const {getTime} = require('./src/getTime');

const API_KEY = process.env.API_KEY;
const app = express();

app.get('/', (req, res) => {
    axios.defaults.baseURL = 'https://youtube.googleapis.com';

    const ID = "PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p";
    
    let nextPage = "";
    let videos = [];
    getData(ID);
    async function getData(ID) {
        const response = await axios.get("/youtube/v3/playlistItems", {
            params: {
                part: "contentDetails",
                playlistId: ID,
                key: API_KEY,
                maxResults: 50,
                pageToken: nextPage
            }
        })
        if (response.data.nextPageToken) {
            nextPage = response.data.nextPageToken;
            getData(ID);
        }
        let arr = response.data.items;
        arr.forEach((item) => {
            videos.push(item.contentDetails.videoId);
        })
        if (videos.length === response.data.pageInfo.totalResults) {
            const start = 0;
            const end = videos.length;
            getTime(videos, start, end);
        }
    }
})
app.listen(process.env.PORT, (req, res) => {
    console.log("listening on port " + process.env.PORT);
})