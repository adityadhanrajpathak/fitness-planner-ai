const express = require('express');
const authMiddleware  = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { getAllUsers, getPlatformStats, promoteUser, demoteUser, findUserByEmail } = require('../models/database');

const router = express.Router();

// ─── Setup First Admin (one-time, uses ADMIN_SECRET env var) ─
// POST /api/admin/setup  { email, adminSecret }
// Anyone can call this — but only with the correct ADMIN_SECRET.
// Use it once to promote yourself, then keep ADMIN_SECRET private.
router.post('/setup', async (req, res) => {
  try {
    const { email, adminSecret } = req.body;
    const secret = process.env.ADMIN_SECRET;

    if (!secret) {
      return res.status(503).json({ error: 'ADMIN_SECRET env variable not set on server.' });
    }
    if (!adminSecret || adminSecret !== secret) {
      return res.status(403).json({ error: 'Invalid admin secret.' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await findUserByEmail.get(email.toLowerCase().trim());
    if (!user) {
      return res.status(404).json({ error: 'No account found with that email.' });
    }

    await promoteUser.run(user.id);
    res.json({ message: `✅ ${user.name} (${user.email}) has been promoted to admin.` });
  } catch (err) {
    console.error('Admin setup error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── All routes below require auth + admin ───────────────────
router.use(authMiddleware);
router.use(adminMiddleware);

// ─── Get Platform Stats ─────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const stats = await getPlatformStats.get();
    res.json({ stats });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch platform stats.' });
  }
});

// ─── Get All Users ──────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers.all();
    res.json({ users });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// ─── Promote User to Admin ──────────────────────────────────
router.post('/users/:id/promote', async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    if (targetId === req.userId) {
      return res.status(400).json({ error: 'You cannot change your own admin status.' });
    }
    await promoteUser.run(targetId);
    res.json({ message: 'User promoted to admin.' });
  } catch (err) {
    console.error('Promote error:', err);
    res.status(500).json({ error: 'Failed to promote user.' });
  }
});

// ─── Demote Admin to User ───────────────────────────────────
router.post('/users/:id/demote', async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    if (targetId === req.userId) {
      return res.status(400).json({ error: 'You cannot demote yourself.' });
    }
    await demoteUser.run(targetId);
    res.json({ message: 'User demoted to regular user.' });
  } catch (err) {
    console.error('Demote error:', err);
    res.status(500).json({ error: 'Failed to demote user.' });
  }
});

module.exports = router;
