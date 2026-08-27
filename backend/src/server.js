const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool, initTables } = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const propertiesRoutes = require('./routes/properties.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const newsRoutes = require('./routes/news.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, health checkers, or curl)
    if (!origin) return callback(null, true);
    if (
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.endsWith(".onrender.com") ||
      (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  allowedHeaders: ["Content-Type", "Authorization", "apikey"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

// Root check
app.get('/', (req, res) => {
  res.send("PropertyHub API is running smoothly!");
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

// Mount modular route handlers
app.use('/auth', authRoutes);
app.use('/properties', propertiesRoutes);
app.use('/properties', reviewsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/news', newsRoutes);

// Server startup function
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 PropertyHub API is listening on port ${PORT}`);
  });

  // Initialize database asynchronously without blocking immediate server binding
  initTables()
    .then(() => {
      console.log("✅ Database initialized and verified successfully.");
    })
    .catch((err) => {
      console.error("⚠️ Warning: Initial database check failed:", err.message);
    });

  return server;
};

// Start if executed directly
if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer
};
