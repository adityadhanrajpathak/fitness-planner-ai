const jwt = require('jsonwebtoken');
const config = require('../config');
const { findUserById } = require('../models/database');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Verify user still exists in the database (await was previously missing — critical bug fix)
    const user = await findUserById.get(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists. Please log in again.' });
    }

    req.userId   = decoded.userId;
    req.userRole = user.is_admin === 1 ? 'admin' : 'user';
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = authMiddleware;