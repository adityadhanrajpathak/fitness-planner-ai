const { findUserById } = require('../models/database');

function adminMiddleware(req, res, next) {
  // Assumes authMiddleware has already run and set req.userId
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const user = findUserById.get(req.userId);
  if (!user || user.is_admin !== 1) {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }

  next();
}

module.exports = adminMiddleware;
