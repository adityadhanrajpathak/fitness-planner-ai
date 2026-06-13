const { findUserById } = require('../models/database');

async function adminMiddleware(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    const user = await findUserById.get(req.userId);
    if (!user || user.is_admin !== 1) {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = adminMiddleware;
