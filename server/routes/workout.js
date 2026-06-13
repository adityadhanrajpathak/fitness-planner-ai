const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getProfile, deactivateWorkoutPlans, insertWorkoutPlan, getActiveWorkoutPlan } = require('../models/database');
const { generateWorkoutPlan } = require('../ai/workoutGen');
const { analyzeProfile } = require('../ai/engine');

const router = express.Router();
router.use(authMiddleware);

// ─── Generate New Workout Plan ──────────────────────────────
router.post('/generate', async (req, res) => {
  try {
    const profile = await getProfile.get(req.userId);
    if (!profile) {
      return res.status(400).json({ error: 'Please complete your profile first.' });
    }

    const parsed = {
      ...profile,
      dietary_restrictions: JSON.parse(profile.dietary_restrictions || '[]'),
      equipment: JSON.parse(profile.equipment || '[]')
    };

    const plan = generateWorkoutPlan(parsed);

    await deactivateWorkoutPlans.run(req.userId);
    await insertWorkoutPlan.run(req.userId, JSON.stringify(plan));

    res.json({ plan });
  } catch (err) {
    console.error('Workout generation error:', err);
    res.status(500).json({ error: 'Failed to generate workout plan.' });
  }
});

// ─── Get Active Workout Plan ────────────────────────────────
router.get('/current', async (req, res) => {
  try {
    const planRow = await getActiveWorkoutPlan.get(req.userId);
    if (!planRow) return res.json({ plan: null });
    res.json({ plan: JSON.parse(planRow.plan_data), id: planRow.id, createdAt: planRow.created_at });
  } catch (err) {
    console.error('Get workout error:', err);
    res.status(500).json({ error: 'Failed to fetch workout plan.' });
  }
});

// ─── Get Health Analysis ────────────────────────────────────
router.get('/analysis', async (req, res) => {
  try {
    const profile = await getProfile.get(req.userId);
    if (!profile) {
      return res.status(400).json({ error: 'Please complete your profile first.' });
    }
    const parsed = {
      ...profile,
      dietary_restrictions: JSON.parse(profile.dietary_restrictions || '[]'),
      equipment: JSON.parse(profile.equipment || '[]')
    };
    const analysis = analyzeProfile(parsed);
    res.json({ analysis });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Failed to fetch analysis.' });
  }
});

module.exports = router;
