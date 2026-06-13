/**
 * database.js — @libsql/client backed SQLite (Turso cloud + local file fallback)
 *
 * Production: uses Turso cloud (persistent across serverless cold starts)
 * Local dev:  uses a local file via TURSO_DATABASE_URL=file:./data/fitness.db
 *
 * All methods return Promises — route handlers must await them.
 */

const { createClient } = require('@libsql/client');
const path = require('path');

// ─── Client singleton ────────────────────────────────────────
let _client = null;

function getClient() {
  if (!_client) {
    _client = createClient({
      url:       process.env.TURSO_DATABASE_URL || 'file::memory:?cache=shared',
      authToken: process.env.TURSO_AUTH_TOKEN   || undefined
    });
  }
  return _client;
}

// ─── Schema ──────────────────────────────────────────────────
async function initDatabase() {
  const db = getClient();
  await db.batch([
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      age INTEGER,
      gender TEXT,
      height REAL,
      weight REAL,
      activity_level TEXT DEFAULT 'moderate',
      fitness_goal TEXT DEFAULT 'maintain',
      dietary_restrictions TEXT DEFAULT '[]',
      cultural_preference TEXT DEFAULT 'mixed',
      budget TEXT DEFAULT 'moderate',
      equipment TEXT DEFAULT '[]',
      meals_per_day INTEGER DEFAULT 3,
      workout_days INTEGER DEFAULT 4,
      workout_duration INTEGER DEFAULT 45,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS workout_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_data TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS diet_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_data TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS progress_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      weight REAL,
      workout_completed INTEGER DEFAULT 0,
      calories_consumed INTEGER,
      water_intake REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ], 'write');
  console.log('✅ Turso/libsql database ready');
}

// ─── Row helper ──────────────────────────────────────────────
// libsql rows expose named properties but are not plain objects — spread them.
function toObj(row) {
  if (!row) return undefined;
  return Object.fromEntries(Object.entries(row));
}

// ─── Query helpers ───────────────────────────────────────────
function prepare(sql) {
  return {
    async get(...params) {
      const result = await getClient().execute({ sql, args: params.flat() });
      return toObj(result.rows[0]);
    },
    async all(...params) {
      const result = await getClient().execute({ sql, args: params.flat() });
      return result.rows.map(toObj);
    },
    async run(...params) {
      const result = await getClient().execute({ sql, args: params.flat() });
      return {
        changes:         result.rowsAffected,
        lastInsertRowid: result.lastInsertRowid ?? null
      };
    }
  };
}

// ─── Prepared queries ────────────────────────────────────────

// Users
const createUser      = prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)');
const findUserByEmail = prepare('SELECT * FROM users WHERE email = ?');
const findUserById    = prepare('SELECT id, email, name, is_admin, created_at FROM users WHERE id = ?');

// Profiles
const upsertProfile = prepare(`
  INSERT INTO profiles
    (user_id, age, gender, height, weight, activity_level, fitness_goal,
     dietary_restrictions, cultural_preference, budget, equipment,
     meals_per_day, workout_days, workout_duration, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(user_id) DO UPDATE SET
    age=excluded.age, gender=excluded.gender, height=excluded.height,
    weight=excluded.weight, activity_level=excluded.activity_level,
    fitness_goal=excluded.fitness_goal,
    dietary_restrictions=excluded.dietary_restrictions,
    cultural_preference=excluded.cultural_preference, budget=excluded.budget,
    equipment=excluded.equipment, meals_per_day=excluded.meals_per_day,
    workout_days=excluded.workout_days, workout_duration=excluded.workout_duration,
    updated_at=CURRENT_TIMESTAMP
`);
const getProfile = prepare('SELECT * FROM profiles WHERE user_id = ?');

// Workout plans
const deactivateWorkoutPlans = prepare('UPDATE workout_plans SET is_active = 0 WHERE user_id = ?');
const insertWorkoutPlan      = prepare('INSERT INTO workout_plans (user_id, plan_data) VALUES (?, ?)');
const getActiveWorkoutPlan   = prepare('SELECT * FROM workout_plans WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 1');
const getWorkoutHistory      = prepare('SELECT id, created_at FROM workout_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 10');

// Diet plans
const deactivateDietPlans = prepare('UPDATE diet_plans SET is_active = 0 WHERE user_id = ?');
const insertDietPlan      = prepare('INSERT INTO diet_plans (user_id, plan_data) VALUES (?, ?)');
const getActiveDietPlan   = prepare('SELECT * FROM diet_plans WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 1');

// Progress
const insertProgress         = prepare('INSERT INTO progress_logs (user_id, date, weight, workout_completed, calories_consumed, water_intake, notes) VALUES (?, ?, ?, ?, ?, ?, ?)');
const getProgressByDateRange = prepare('SELECT * FROM progress_logs WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date ASC');
const getLatestProgress      = prepare('SELECT * FROM progress_logs WHERE user_id = ? ORDER BY date DESC LIMIT 30');

// Admin
const getAllUsers       = prepare('SELECT id, email, name, is_admin, created_at FROM users ORDER BY created_at DESC');
const getPlatformStats = prepare(`
  SELECT
    (SELECT COUNT(*) FROM users)                          AS totalUsers,
    (SELECT COUNT(*) FROM workout_plans WHERE is_active=1) AS activeWorkoutPlans,
    (SELECT COUNT(*) FROM progress_logs)                  AS totalProgressLogs
`);

// ─── Exports ─────────────────────────────────────────────────
module.exports = {
  initDatabase,
  createUser, findUserByEmail, findUserById,
  upsertProfile, getProfile,
  deactivateWorkoutPlans, insertWorkoutPlan, getActiveWorkoutPlan, getWorkoutHistory,
  deactivateDietPlans, insertDietPlan, getActiveDietPlan,
  insertProgress, getProgressByDateRange, getLatestProgress,
  getAllUsers, getPlatformStats
};
