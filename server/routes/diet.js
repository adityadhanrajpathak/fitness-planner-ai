const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getProfile, deactivateDietPlans, insertDietPlan, getActiveDietPlan } = require('../models/database');
const { generateDietPlan } = require('../ai/dietGen');

const router = express.Router();
router.use(authMiddleware);

// ─── Generate New Diet Plan ─────────────────────────────────
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

    const plan = generateDietPlan(parsed);

    await deactivateDietPlans.run(req.userId);
    await insertDietPlan.run(req.userId, JSON.stringify(plan));

    res.json({ plan });
  } catch (err) {
    console.error('Diet generation error:', err);
    res.status(500).json({ error: 'Failed to generate diet plan.' });
  }
});

// ─── Get Active Diet Plan ───────────────────────────────────
router.get('/current', async (req, res) => {
  try {
    const planRow = await getActiveDietPlan.get(req.userId);
    if (!planRow) return res.json({ plan: null });
    res.json({ plan: JSON.parse(planRow.plan_data), id: planRow.id, createdAt: planRow.created_at });
  } catch (err) {
    console.error('Get diet error:', err);
    res.status(500).json({ error: 'Failed to fetch diet plan.' });
  }
});

module.exports = router;
