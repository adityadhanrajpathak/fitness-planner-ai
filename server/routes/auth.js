const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { createUser, findUserByEmail, findUserById } = require('../models/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── Register ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = findUserByEmail.get(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);
    const result = createUser.run(email.toLowerCase().trim(), passwordHash, name.trim());

    const userId = Number(result.lastInsertRowid);

    const token = jwt.sign({ userId }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });

    res.status(201).json({
      token,
      user: { id: userId, email, name }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// ─── Login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = findUserByEmail.get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ─── Get Current User ───────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  const user = findUserById.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user });
});

module.exports = router;
