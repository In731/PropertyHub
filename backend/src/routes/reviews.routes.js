const express = require('express');
const router = express.Router({ mergeParams: true });
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// Get Reviews for a Property
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, property_id, user_id, user_name, rating, comment, created_at FROM ph_reviews WHERE property_id = $1 ORDER BY created_at DESC",
      [id]
    );
    res.json(result.rows ?? []);
  } catch (e) {
    console.error("fetch reviews error:", e);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Create Review for a Property
router.post('/:id/reviews', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userName = req.userName;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and comment are required" });
    }

    const rVal = parseInt(rating, 10);
    if (isNaN(rVal) || rVal < 1 || rVal > 5) {
      return res.status(400).json({ error: "Rating must be an integer between 1 and 5" });
    }

    const result = await pool.query(
      "INSERT INTO ph_reviews (property_id, user_id, user_name, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING id, property_id, user_id, user_name, rating, comment, created_at",
      [id, userId, userName, rVal, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error("create review error:", e);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// Update Review
router.put('/:id/reviews/:reviewId', requireAuth, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userId = req.userId;
    const { rating, comment } = req.body;

    const existing = await pool.query("SELECT user_id FROM ph_reviews WHERE id = $1 AND property_id = $2", [reviewId, id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Review not found" });
    if (existing.rows[0].user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

    const result = await pool.query(
      "UPDATE ph_reviews SET rating = $1, comment = $2 WHERE id = $3 RETURNING id, property_id, user_id, user_name, rating, comment, created_at",
      [rating, comment, reviewId]
    );

    res.json(result.rows[0]);
  } catch (e) {
    console.error("update review error:", e);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// Delete Review
router.delete('/:id/reviews/:reviewId', requireAuth, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userId = req.userId;

    const existing = await pool.query("SELECT user_id FROM ph_reviews WHERE id = $1 AND property_id = $2", [reviewId, id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Review not found" });
    if (existing.rows[0].user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

    await pool.query("DELETE FROM ph_reviews WHERE id = $1", [reviewId]);
    res.json({ success: true });
  } catch (e) {
    console.error("delete review error:", e);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
