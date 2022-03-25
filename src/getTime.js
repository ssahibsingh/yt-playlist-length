const axios = require('axios');
const format = require('youtube-duration-format');
const { addTime } = require('../utils/addTime');

const API_KEY = process.env.API_KEY;
axios.defaults.baseURL = 'https://youtube.googleapis.com';

async function getTime(videos, start, end) {
    let videoLen = end - start;
    let time = '00:00:00';
    let j = 0;
    for (j = 0; j < Math.floor(videoLen / 50); j++) {
        let videoString = "";
        videoString = videos[start + 50 * j];
        for (let i = start + 50 * j + 1; i < start + 50 * (j + 1); i++) {
            videoString = videoString + ',' + videos[i];
        }
        const resp = await axios.get("/youtube/v3/videos", {
            params: {
                part: "contentDetails",
                id: videoString,
                key: API_KEY,
            }
        })
        let arr = resp.data.items;
        arr.forEach((item) => {
            let dur = format(item.contentDetails.duration);
            if (!(dur.length > 5)) {
                dur = "00:" + dur;
            }
            time = addTime(time, dur);
        })
    }
    let videoString = videos[start + 50 * j];
    for (let i = start + 50 * j + 1; i < start + 50 * j + videoLen % 50; i++) {
        videoString = videoString + ',' + videos[i];
    }
    const resp = await axios.get("/youtube/v3/videos", {
        params: {
            part: "contentDetails",
            id: videoString,
            key: API_KEY,
        }
    })
    let arr = resp.data.items;
    arr.forEach((item) => {
        let dur = format(item.contentDetails.duration);
        if (!(dur.length > 5)) {
            dur = "00:" + dur;
        }
        time = addTime(time, dur);
    })
    console.log(time);
}

module.exports = { getTime };