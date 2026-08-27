const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { rowToProperty } = require('../utils/serializers');

// Get Properties (with search, filter, pagination)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 9, 
      city, 
      minPrice, 
      maxPrice, 
      type, 
      status, 
      bedrooms 
    } = req.query;

    let queryParams = [];
    let whereClauses = [];

    if (city) {
      queryParams.push(`%${city}%`);
      whereClauses.push(`(city ILIKE $${queryParams.length} OR location ILIKE $${queryParams.length})`);
    }
    if (minPrice) {
      queryParams.push(minPrice);
      whereClauses.push(`price >= $${queryParams.length}`);
    }
    if (maxPrice) {
      queryParams.push(maxPrice);
      whereClauses.push(`price <= $${queryParams.length}`);
    }
    if (type && type !== 'all') {
      queryParams.push(type);
      whereClauses.push(`type = $${queryParams.length}`);
    }
    if (status && status !== 'all') {
      queryParams.push(status);
      whereClauses.push(`status = $${queryParams.length}`);
    }
    if (bedrooms) {
      queryParams.push(bedrooms);
      whereClauses.push(`bedrooms >= $${queryParams.length}`);
    }

    let whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    // Count query for pagination
    const countQuery = `SELECT COUNT(*) FROM ph_properties ${whereSql}`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count, 10);
    
    // Data query with pagination
    const offset = (page - 1) * limit;
    queryParams.push(limit);
    const limitIdx = queryParams.length;
    queryParams.push(offset);
    const offsetIdx = queryParams.length;
    
    const dataQuery = `SELECT * FROM ph_properties ${whereSql} ORDER BY created_at DESC LIMIT $${limitIdx} OFFSET $${offsetIdx}`;
    const result = await pool.query(dataQuery, queryParams);
    
    res.json({
      data: (result.rows ?? []).map(rowToProperty),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (e) {
    console.error("list properties error:", e);
    res.json({ data: [], total: 0, page: 1, totalPages: 0 });
  }
});

// Create Property
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const userName = req.userName;
    const body = req.body;

    const result = await pool.query(
      `INSERT INTO ph_properties (
        title, price, location, city, bedrooms, bathrooms, area, type, status, image, images, description, amenities, year_built, parking, furnished, rera_number, user_id, user_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
      [
        body.title,
        body.price,
        body.location,
        body.city,
        body.bedrooms ?? 0,
        body.bathrooms ?? 0,
        body.area,
        body.type,
        body.status,
        body.image,
        JSON.stringify(body.images || [body.image]),
        body.description,
        JSON.stringify(body.amenities || []),
        body.yearBuilt ?? null,
        body.parking ?? 0,
        body.furnished ?? false,
        body.reraNumber ?? null,
        userId,
        userName
      ]
    );

    res.status(201).json(rowToProperty(result.rows[0]));
  } catch (e) {
    console.error("create property error:", e);
    res.status(500).json({ error: "Failed to create property" });
  }
});

// Get Single Property
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM ph_properties WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json(rowToProperty(result.rows[0]));
  } catch (e) {
    console.error("get property error:", e);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

// Update Property
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const body = req.body;

    // Ownership check
    const existing = await pool.query("SELECT user_id FROM ph_properties WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Property not found" });
    if (existing.rows[0].user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

    const result = await pool.query(
      `UPDATE ph_properties SET 
        title = $1, price = $2, location = $3, city = $4, bedrooms = $5, bathrooms = $6, area = $7, type = $8, status = $9, image = $10, images = $11, description = $12, amenities = $13, year_built = $14, parking = $15, furnished = $16, rera_number = $17
      WHERE id = $18 RETURNING *`,
      [
        body.title, body.price, body.location, body.city, body.bedrooms ?? 0, body.bathrooms ?? 0, body.area, body.type, body.status, body.image, JSON.stringify(body.images || [body.image]), body.description, JSON.stringify(body.amenities || []), body.yearBuilt ?? null, body.parking ?? 0, body.furnished ?? false, body.reraNumber ?? null,
        id
      ]
    );

    res.json(rowToProperty(result.rows[0]));
  } catch (e) {
    console.error("update property error:", e);
    res.status(500).json({ error: "Failed to update property" });
  }
});

// Delete Property
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Ownership check
    const existing = await pool.query("SELECT user_id FROM ph_properties WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Property not found" });
    if (existing.rows[0].user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

    await pool.query("DELETE FROM ph_properties WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (e) {
    console.error("delete property error:", e);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

module.exports = router;
