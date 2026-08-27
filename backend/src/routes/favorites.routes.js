const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { rowToProperty } = require('../utils/serializers');

// Get User's Favorites
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const query = `
      SELECT p.* 
      FROM ph_properties p
      INNER JOIN ph_favorites f ON p.id = f.property_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    res.json((result.rows ?? []).map(rowToProperty));
  } catch (e) {
    console.error("fetch favorites error:", e);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// Add Favorite
router.post('/:propertyId', requireAuth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.userId;

    // Check if already favorited
    const existing = await pool.query("SELECT id FROM ph_favorites WHERE user_id = $1 AND property_id = $2", [userId, propertyId]);
    if (existing.rows.length === 0) {
      await pool.query("INSERT INTO ph_favorites (user_id, property_id) VALUES ($1, $2)", [userId, propertyId]);
    }
    res.json({ success: true });
  } catch (e) {
    console.error("add favorite error:", e);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Remove Favorite
router.delete('/:propertyId', requireAuth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.userId;

    await pool.query("DELETE FROM ph_favorites WHERE user_id = $1 AND property_id = $2", [userId, propertyId]);
    res.json({ success: true });
  } catch (e) {
    console.error("remove favorite error:", e);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

module.exports = router;
