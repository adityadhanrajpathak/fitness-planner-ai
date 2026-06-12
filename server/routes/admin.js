const express = require('express');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { getAllUsers, getPlatformStats } = require('../models/database');

const router = express.Router();

// Protect all admin routes with auth and admin middlewares
router.use(authMiddleware);
router.use(adminMiddleware);

// ─── Get Platform Stats ─────────────────────────────────────
router.get('/stats', (req, res) => {
  try {
    const stats = getPlatformStats.get();
    res.json({ stats });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch platform stats.' });
  }
});

// ─── Get All Users ──────────────────────────────────────────
router.get('/users', (req, res) => {
  try {
    const users = getAllUsers.all();
    res.json({ users });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

module.exports = router;
