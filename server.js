import express from "express";
import cors from "cors";
import { fetchRedditComments } from "./reddit.js";

const app = express();
app.use(cors());

function extractSentiment(comment) {
    let text = comment.toLowerCase();
    let positive = ["good", "great", "amazing", "fantastic", "excellent", "love"];
    let negative = ["bad", "worst", "boring", "terrible", "hate"];
    let rating = 5;

    positive.forEach(w => text.includes(w) && rating++);
    negative.forEach(w => text.includes(w) && rating--);
    return Math.max(1, Math.min(10, rating));
}

app.get("/movie", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ error: "Movie name required!" });

    const comments = await fetchRedditComments(query);

    let processed = comments.map(c => ({
        body: c.body,
        score: c.score,
        sentiment: extractSentiment(c.body)
    }));

    let avgRating = processed.reduce((a, b) => a + b.sentiment, 0) / processed.length;

    res.json({
        total_comments: processed.length,
        avg_rating: avgRating,
        top_upvoted: processed.sort((a,b)=>b.score-a.score).slice(0,5),
        top_downvoted: processed.sort((a,b)=>a.score-b.score).slice(0,5),
        trend: processed.map(p => p.sentiment)
    });
});

app.listen(5000, () => console.log("Backend running on port 5000"));