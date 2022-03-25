const axios = require('axios');
const { getTime } = require('./getTime');

let nextPage = "";
let videos = [];
axios.defaults.baseURL = 'https://youtube.googleapis.com';
const API_KEY = process.env.API_KEY;
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

module.exports = { getData };