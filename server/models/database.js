const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Ensure data directory exists
const dataDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(config.DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
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
  );

  CREATE TABLE IF NOT EXISTS workout_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_data TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS diet_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_data TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS progress_logs (
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
  );
`);

// ─── User Queries ───────────────────────────────────────────

const createUser = db.prepare(`
  INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)
`);

const findUserByEmail = db.prepare(`
  SELECT * FROM users WHERE email = ?
`);

const findUserById = db.prepare(`
  SELECT id, email, name, created_at FROM users WHERE id = ?
`);

// ─── Profile Queries ────────────────────────────────────────

const upsertProfile = db.prepare(`
  INSERT INTO profiles (user_id, age, gender, height, weight, activity_level, fitness_goal, dietary_restrictions, cultural_preference, budget, equipment, meals_per_day, workout_days, workout_duration, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(user_id) DO UPDATE SET
    age = excluded.age,
    gender = excluded.gender,
    height = excluded.height,
    weight = excluded.weight,
    activity_level = excluded.activity_level,
    fitness_goal = excluded.fitness_goal,
    dietary_restrictions = excluded.dietary_restrictions,
    cultural_preference = excluded.cultural_preference,
    budget = excluded.budget,
    equipment = excluded.equipment,
    meals_per_day = excluded.meals_per_day,
    workout_days = excluded.workout_days,
    workout_duration = excluded.workout_duration,
    updated_at = CURRENT_TIMESTAMP
`);

const getProfile = db.prepare(`
  SELECT * FROM profiles WHERE user_id = ?
`);

// ─── Workout Plan Queries ───────────────────────────────────

const deactivateWorkoutPlans = db.prepare(`
  UPDATE workout_plans SET is_active = 0 WHERE user_id = ?
`);

const insertWorkoutPlan = db.prepare(`
  INSERT INTO workout_plans (user_id, plan_data) VALUES (?, ?)
`);

const getActiveWorkoutPlan = db.prepare(`
  SELECT * FROM workout_plans WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 1
`);

const getWorkoutHistory = db.prepare(`
  SELECT id, created_at FROM workout_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
`);

// ─── Diet Plan Queries ──────────────────────────────────────

const deactivateDietPlans = db.prepare(`
  UPDATE diet_plans SET is_active = 0 WHERE user_id = ?
`);

const insertDietPlan = db.prepare(`
  INSERT INTO diet_plans (user_id, plan_data) VALUES (?, ?)
`);

const getActiveDietPlan = db.prepare(`
  SELECT * FROM diet_plans WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 1
`);

// ─── Progress Queries ───────────────────────────────────────

const insertProgress = db.prepare(`
  INSERT INTO progress_logs (user_id, date, weight, workout_completed, calories_consumed, water_intake, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const getProgressByDateRange = db.prepare(`
  SELECT * FROM progress_logs WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date ASC
`);

const getLatestProgress = db.prepare(`
  SELECT * FROM progress_logs WHERE user_id = ? ORDER BY date DESC LIMIT 30
`);

module.exports = {
  db,
  createUser,
  findUserByEmail,
  findUserById,
  upsertProfile,
  getProfile,
  deactivateWorkoutPlans,
  insertWorkoutPlan,
  getActiveWorkoutPlan,
  getWorkoutHistory,
  deactivateDietPlans,
  insertDietPlan,
  getActiveDietPlan,
  insertProgress,
  getProgressByDateRange,
  getLatestProgress
};
