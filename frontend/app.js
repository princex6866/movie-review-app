const backendURL = "https://movie-review-app-production.up.railway.app/movie";

document.getElementById("darkToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

async function searchMovie() {
    let q = document.getElementById("movieInput").value;
    let res = await fetch(`${backendURL}?q=${q}`);
    let data = await res.json();

    document.getElementById("results").innerHTML = `
        <h2>${q}</h2>
        <p><b>Total Comments:</b> ${data.total_comments}</p>
        <p><b>Average Rating:</b> ${data.avg_rating.toFixed(2)}/10</p>
        <h3>Top 5 Upvoted Comments</h3>
        ${data.top_upvoted.map(c => `<p>👍(${c.score}) - ${c.body}</p>`).join("")}
        <h3>Top 5 Downvoted Comments</h3>
        ${data.top_downvoted.map(c => `<p>👎(${c.score}) - ${c.body}</p>`).join("")}
    `;
    drawTrendChart(data.trend);
}

function drawTrendChart(trend) {
    new Chart(document.getElementById("trendChart"), {
        type: "line",
        data: {
            labels: trend.map((_, i) => i + 1),
            datasets: [{
                label: "Rating Trend",
                data: trend
            }]
        }
    });
}
