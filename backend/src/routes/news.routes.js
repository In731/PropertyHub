const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rssUrl = encodeURIComponent("https://news.google.com/rss/search?q=real+estate+India");
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    if (!response.ok) {
      return res.status(502).json({ error: "Failed to fetch external news" });
    }
    const data = await response.json();
    res.json(data.items || []);
  } catch (e) {
    console.error("fetch news error:", e);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
