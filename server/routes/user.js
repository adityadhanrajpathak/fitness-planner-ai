const express = require('express');
const authMiddleware = require('../middleware/auth');
const { upsertProfile, getProfile, insertProgress, getLatestProgress } = require('../models/database');

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

// ─── Save/Update Profile ────────────────────────────────────
router.put('/profile', (req, res) => {
  try {
    const {
      age, gender, height, weight,
      activity_level, fitness_goal,
      dietary_restrictions, cultural_preference,
      budget, equipment, meals_per_day,
      workout_days, workout_duration
    } = req.body;

    upsertProfile.run(
      req.userId,
      age || null,
      gender || null,
      height || null,
      weight || null,
      activity_level || 'moderate',
      fitness_goal || 'maintain',
      JSON.stringify(dietary_restrictions || []),
      cultural_preference || 'mixed',
      budget || 'moderate',
      JSON.stringify(equipment || []),
      meals_per_day || 3,
      workout_days || 4,
      workout_duration || 45
    );

    const profile = getProfile.get(req.userId);
    res.json({ profile: parseProfile(profile) });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ─── Get Profile ────────────────────────────────────────────
router.get('/profile', (req, res) => {
  const profile = getProfile.get(req.userId);
  if (!profile) {
    return res.json({ profile: null });
  }
  res.json({ profile: parseProfile(profile) });
});

// ─── Log Progress ───────────────────────────────────────────
router.post('/progress', (req, res) => {
  try {
    const { date, weight, workout_completed, calories_consumed, water_intake, notes } = req.body;
    
    insertProgress.run(
      req.userId,
      date || new Date().toISOString().split('T')[0],
      weight || null,
      workout_completed ? 1 : 0,
      calories_consumed || null,
      water_intake || null,
      notes || null
    );

    res.status(201).json({ message: 'Progress logged successfully.' });
  } catch (err) {
    console.error('Progress log error:', err);
    res.status(500).json({ error: 'Failed to log progress: ' + err.message });
  }
});

// ─── Get Progress History ───────────────────────────────────
router.get('/progress', (req, res) => {
  const logs = getLatestProgress.all(req.userId);
  res.json({ progress: logs });
});

// ─── Helper ─────────────────────────────────────────────────
function parseProfile(profile) {
  if (!profile) return null;
  return {
    ...profile,
    dietary_restrictions: JSON.parse(profile.dietary_restrictions || '[]'),
    equipment: JSON.parse(profile.equipment || '[]')
  };
}

module.exports = router;
