const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, initTables } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const PREFIX = "/make-server-1d78ad60";
const JWT_SECRET = process.env.JWT_SECRET || "ph_jwt_secret_k7x9m2p4_2024";

app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization", "apikey"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json());

// Helper function to map database row to frontend property model
function rowToProperty(row) {
  return {
    id:          row.id,
    title:       row.title,
    price:       Number(row.price),
    location:    row.location,
    city:        row.city,
    bedrooms:    row.bedrooms ?? 0,
    bathrooms:   row.bathrooms ?? 0,
    area:        Number(row.area),
    type:        row.type,
    status:      row.status,
    image:       row.image,
    images:      row.images ?? [row.image],
    description: row.description ?? "",
    amenities:   row.amenities ?? [],
    yearBuilt:   row.year_built ?? undefined,
    parking:     row.parking ?? 0,
    furnished:   row.furnished ?? false,
    reraNumber:  row.rera_number ?? undefined,
    userId:      row.user_id ?? undefined,
    userName:    row.user_name ?? undefined,
  };
}

// Auth Middleware
const requireAuth = async (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.userName = payload.name;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Health Check
app.get(`${PREFIX}/health`, (req, res) => {
  res.json({ status: "ok" });
});

// Setup DB Tables route
app.post(`${PREFIX}/setup`, async (req, res) => {
  await initTables();
  res.json({ status: "done" });
});

// Sign Up Route
app.post(`${PREFIX}/auth/signup`, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    // Check if email exists
    const existing = await pool.query("SELECT id FROM ph_users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const insertResult = await pool.query(
      "INSERT INTO ph_users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hash]
    );
    const user = insertResult.rows[0];

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error("signup error:", e);
    res.status(500).json({ error: e.message ?? "Signup failed" });
  }
});

// Login Route
app.post(`${PREFIX}/auth/login`, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM ph_users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error("login error:", e);
    res.status(500).json({ error: "Login failed" });
  }
});

// Update Profile
app.put(`${PREFIX}/auth/profile`, requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;

    const result = await pool.query(
      "UPDATE ph_users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email",
      [name, email, userId]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error("profile update error:", e);
    res.status(500).json({ error: "Update failed" });
  }
});

// Update Password
app.put(`${PREFIX}/auth/password`, requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    const result = await pool.query("SELECT password_hash FROM ph_users WHERE id = $1", [userId]);
    const row = result.rows[0];

    if (!row) {
      return res.status(404).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(currentPassword, row.password_hash);
    if (!valid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE ph_users SET password_hash = $1 WHERE id = $2", [newHash, userId]);

    res.json({ success: true });
  } catch (e) {
    console.error("password update error:", e);
    res.status(500).json({ error: "Password update failed" });
  }
});

// Get Properties
app.get(`${PREFIX}/properties`, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ph_properties ORDER BY created_at DESC");
    res.json((result.rows ?? []).map(rowToProperty));
  } catch (e) {
    console.error("list properties error:", e);
    res.json([]);
  }
});

// Create Property
app.post(`${PREFIX}/properties`, requireAuth, async (req, res) => {
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

// Get Reviews for a Property
app.get(`${PREFIX}/properties/:id/reviews`, async (req, res) => {
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
app.post(`${PREFIX}/properties/:id/reviews`, requireAuth, async (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
