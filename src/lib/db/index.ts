import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'shift.db');
export const db = new Database(dbPath);

// Enable WAL mode and foreign keys for high performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      preferred_name TEXT,
      dob TEXT,
      sex TEXT,
      country TEXT,
      state TEXT,
      city TEXT,
      timezone TEXT,
      occupation TEXT,
      work_schedule TEXT,
      routine TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS body_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      height_cm REAL,
      weight_kg REAL,
      waist_cm REAL,
      hips_cm REAL,
      body_fat_pct REAL,
      weight_goal TEXT,
      desired_direction TEXT,
      activity_level TEXT,
      daily_steps_est INTEGER,
      exercise_freq TEXT,
      bmi REAL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS goals (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      primary_goals TEXT NOT NULL, -- JSON array
      success_definition TEXT,
      past_barriers TEXT, -- JSON array
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS health_screens (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      conditions TEXT, -- JSON array
      has_medication TEXT, -- 'YES' | 'NO' | 'NOT_SURE'
      medication_details TEXT,
      pregnant_or_postpartum INTEGER DEFAULT 0,
      safety_status TEXT DEFAULT 'NORMAL', -- 'NORMAL' | 'WATCH' | 'DOCTOR_RECOMMENDED' | 'URGENT'
      safety_notes TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS allergy_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      allergies TEXT, -- JSON array of strict allergens
      intolerances TEXT, -- JSON array
      preferences TEXT, -- JSON array
      cultural_restrictions TEXT, -- JSON array
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS food_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      dining_locations TEXT, -- JSON array: home, office, restaurant, etc.
      outside_eating_freq TEXT,
      cook_source TEXT,
      favorite_foods TEXT, -- JSON array
      cuisine_preferences TEXT, -- JSON array: Kerala, South Indian, North Indian, Continental, etc.
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lifestyle_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      sleep_hours REAL,
      bedtime TEXT,
      wake_time TEXT,
      sleep_consistency TEXT,
      water_liters REAL,
      daily_steps INTEGER,
      work_hours REAL,
      screen_time REAL,
      stress_level TEXT,
      smoking_status TEXT,
      alcohol_use TEXT,
      travel_freq TEXT,
      night_shift INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skin_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      perceived_type TEXT,
      concerns TEXT, -- JSON array
      sensitivity TEXT,
      redness TEXT,
      sun_exposure TEXT,
      sunscreen_use TEXT,
      current_routine TEXT,
      product_allergies TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS five_dials (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      dial_plate INTEGER DEFAULT 3, -- 1-5
      dial_move INTEGER DEFAULT 3,
      dial_lift INTEGER DEFAULT 2,
      dial_rest INTEGER DEFAULT 3,
      dial_repeat INTEGER DEFAULT 4,
      plate_action TEXT,
      move_action TEXT,
      lift_action TEXT,
      rest_action TEXT,
      repeat_action TEXT,
      plate_streak INTEGER DEFAULT 0,
      move_streak INTEGER DEFAULT 0,
      lift_streak INTEGER DEFAULT 0,
      rest_streak INTEGER DEFAULT 0,
      repeat_streak INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS daily_checkins (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL, -- YYYY-MM-DD
      sleep_hours REAL,
      sleep_quality TEXT,
      water_ml INTEGER,
      movement_type TEXT,
      movement_duration_mins INTEGER,
      meals_followed_plan TEXT,
      energy_level INTEGER, -- 1-5
      stress_level INTEGER, -- 1-5
      weight_kg REAL,
      waist_cm REAL,
      mood TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS meal_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      meal_type TEXT NOT NULL, -- Breakfast, Lunch, Snack, Dinner
      food_items TEXT NOT NULL,
      portion_desc TEXT,
      protein_present INTEGER DEFAULT 0,
      plants_present INTEGER DEFAULT 0,
      hunger_before INTEGER, -- 1-5
      fullness_after INTEGER, -- 1-5
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS journey_progress (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      current_day INTEGER DEFAULT 1,
      completed_days TEXT DEFAULT '[]', -- JSON array of day numbers
      streak INTEGER DEFAULT 0,
      last_completed_at TEXT,
      reflections TEXT DEFAULT '{}', -- JSON map day_number -> text
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skin_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      am_cleanse INTEGER DEFAULT 0,
      am_moisturize INTEGER DEFAULT 0,
      am_sunscreen INTEGER DEFAULT 0,
      pm_cleanse INTEGER DEFAULT 0,
      pm_treatment INTEGER DEFAULT 0,
      pm_moisturize INTEGER DEFAULT 0,
      acne_level INTEGER,
      dryness_level INTEGER,
      oiliness_level INTEGER,
      irritation_level INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS smart_groceries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      item_name TEXT NOT NULL,
      quantity TEXT,
      purchased INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS weekly_reviews (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      week_start_date TEXT NOT NULL,
      wins TEXT,
      difficulties TEXT,
      dial_improvements TEXT,
      dial_needs_attention TEXT,
      next_week_focus_1 TEXT,
      next_week_focus_2 TEXT,
      next_week_focus_3 TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS consents (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      health_profile_consent INTEGER DEFAULT 1,
      recommendations_consent INTEGER DEFAULT 1,
      analytics_consent INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      details TEXT,
      ip_hash TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS saved_articles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      article_slug TEXT NOT NULL,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, article_slug)
    );

    CREATE TABLE IF NOT EXISTS operator_notes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      operator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      note_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS operator_custom_actions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      operator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      dial TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      why_it_matters TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_nudges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      admin_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      nudge_type TEXT DEFAULT 'ENCOURAGEMENT',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS admissions_orders (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      plan_name TEXT NOT NULL,
      amount_inr REAL NOT NULL,
      status TEXT DEFAULT 'PAID',
      payment_method TEXT DEFAULT 'Razorpay / UPI',
      transaction_ref TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS platform_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec(`ALTER TABLE users ADD COLUMN is_suspended INTEGER DEFAULT 0;`);
  } catch {}
}

// Automatically initialize tables on import
initDatabase();
