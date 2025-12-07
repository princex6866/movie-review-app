import axios from "axios";

export async function fetchRedditComments(movieName) {
    let allComments = [];
    let batchSize = 500;
    let before = Math.floor(Date.now() / 1000);

    while (allComments.length < 2000) {
        const url = `https://api.pushshift.io/reddit/comment/search/?q=${encodeURIComponent(
            movieName
        )}&size=${batchSize}&before=${before}`;

        const response = await axios.get(url);
        const comments = response.data.data;

        if (comments.length === 0) break;

        allComments.push(...comments);
        before = comments[comments.length - 1].created_utc;
    }
    return allComments.slice(0, 2000);
}
