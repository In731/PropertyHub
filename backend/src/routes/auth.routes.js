const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { z } = require('zod');
const { pool } = require('../config/db');
const { JWT_SECRET, requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { getTransporter } = require('../utils/email');

// Zod Schemas
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

// Sign Up Route
router.post('/signup', authLimiter, async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { name, email, password } = parsed.data;

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
router.post('/login', authLimiter, async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { email, password } = parsed.data;

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
router.put('/profile', requireAuth, async (req, res) => {
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
router.put('/password', requireAuth, async (req, res) => {
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

// Forgot Password
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const result = await pool.query("SELECT id FROM ph_users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      // Return success even if not found to prevent email enumeration
      return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
    }

    const userId = result.rows[0].id;
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      "UPDATE ph_users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
      [resetToken, resetTokenExpiry, userId]
    );

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: '"PropertyHub" <noreply@propertyhub.com>',
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click this link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`
    });

    console.log("Message sent: %s", info.messageId);
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (e) {
    console.error("forgot password error:", e);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Reset Password
router.post('/reset-password', authLimiter, async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Token and new password are required" });

    const result = await pool.query(
      "SELECT id, reset_token_expiry FROM ph_users WHERE reset_token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = result.rows[0];
    if (new Date() > new Date(user.reset_token_expiry)) {
      return res.status(400).json({ error: "Token has expired" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE ph_users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
      [newHash, user.id]
    );

    res.json({ success: true, message: "Password has been successfully reset" });
  } catch (e) {
    console.error("reset password error:", e);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

module.exports = router;
