const axios = require('axios');
const API_KEY = process.env.API_KEY;
axios.defaults.baseURL = 'https://youtube.googleapis.com';

let nextPage = "";

async function getData(ID) {
    var videos = [];
    const response = await axios.get("/youtube/v3/playlistItems", {
        params: {
            part: "contentDetails",
            playlistId: ID,
            key: API_KEY,
            maxResults: 50
        }
    })

    let totalVideos = response.data.pageInfo.totalResults;

    response.data.items.forEach((item) => {
        videos.push(item.contentDetails.videoId);
    })

    if (response.data.nextPageToken) {
        nextPage = response.data.nextPageToken;
        let videoLen = totalVideos - 50;

        for (let i = 0; i < Math.floor(videoLen / 50); i++) {
            const respo = await axios.get("/youtube/v3/playlistItems", {
                params: {
                    part: "contentDetails",
                    playlistId: ID,
                    key: API_KEY,
                    maxResults: 50,
                    pageToken: nextPage
                }
            })
            respo.data.items.forEach((item) => {
                videos.push(item.contentDetails.videoId);
            })
            nextPage = respo.data.nextPageToken;
        }

        const resp = await axios.get("/youtube/v3/playlistItems", {
            params: {
                part: "contentDetails",
                playlistId: ID,
                key: API_KEY,
                maxResults: 50,
                pageToken: nextPage
            }
        })
        resp.data.items.forEach((item) => {
            videos.push(item.contentDetails.videoId);
        })
    }
    if (videos.length === totalVideos) {
        return [totalVideos,videos];
    }
}


module.exports = {getData};