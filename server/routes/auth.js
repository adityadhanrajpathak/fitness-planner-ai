const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const config  = require('../config');
const {
  createUser, findUserByEmail, findUserById,
  updateUserResetToken, findUserByResetToken, updateUserPassword, clearResetToken
} = require('../models/database');
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

    const existing = await findUserByEmail.get(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);
    const result = await createUser.run(email.toLowerCase().trim(), passwordHash, name.trim());

    const userId = Number(result.lastInsertRowid);
    const token  = jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    res.status(201).json({ token, user: { id: userId, email, name, is_admin: 0 } });
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

    const user = await findUserByEmail.get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ─── Get Current User ───────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await findUserById.get(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── Forgot Password ────────────────────────────────────────
// Generates a 6-char reset token stored in the DB (15-min TTL).
// In production this token would be emailed; here it is returned in the
// response body so the frontend can display it directly.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = await findUserByEmail.get(email.toLowerCase().trim());
    if (!user) {
      return res.status(404).json({ error: 'No account found with that email address.' });
    }

    // 6-character uppercase hex token (e.g. "A3F9C2")
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expires    = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    await updateUserResetToken.run(resetToken, expires, user.id);

    res.json({
      message: 'Reset token generated successfully.',
      token: resetToken,           // displayed in UI — would be emailed in production
      note: 'This token expires in 15 minutes.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error generating reset token.' });
  }
});

// ─── Reset Password ─────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const user = await findUserByResetToken.get(token.toUpperCase().trim());
    if (!user || !user.password_reset_token) {
      return res.status(400).json({ error: 'Invalid reset token. Please request a new one.' });
    }

    if (new Date(user.password_reset_expires) < new Date()) {
      return res.status(400).json({ error: 'This token has expired. Please request a new one.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, config.BCRYPT_ROUNDS);
    await updateUserPassword.run(passwordHash, user.id);
    await clearResetToken.run(user.id);

    res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error resetting password.' });
  }
});

module.exports = router;

