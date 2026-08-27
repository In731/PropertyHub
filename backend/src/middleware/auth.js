const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ph_default_jwt_secret_dev_key_2024';

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ Warning: JWT_SECRET environment variable is not set. Using development secret.");
}

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

module.exports = {
  JWT_SECRET,
  requireAuth
};
