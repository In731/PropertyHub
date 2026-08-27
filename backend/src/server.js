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
  origin: [
    "https://propertyhub-frontend-0yhu.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  allowedHeaders: ["Content-Type", "Authorization", "apikey"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
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
const startServer = async () => {
  try {
    await initTables();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize database and start server:", err);
    process.exit(1);
  }
};

// Start if executed directly
if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer
};
