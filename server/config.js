const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'fitplanner_super_secret_key_2026',
  JWT_EXPIRES_IN: '7d',
  DB_PATH: path.join(__dirname, '..', 'data', 'fitness.db'),
  BCRYPT_ROUNDS: 10
};
