/**
 * Database Schema - SQL Migrations
 *
 * Each migration is an array of SQL statements.
 * Migrations are applied in order based on version number.
 *
 * @see ARCHITECTURE.md Section 5.1 SQLite
 */

export interface Migration {
  version: number;
  description: string;
  up: string[];
}

/**
 * All database migrations in order
 */
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    description: 'Initial schema - routines, exercises, sets, definitions, meta',
    up: [
      // Meta table for app-wide settings
      `CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )`,

      // Exercise definitions (library)
      `CREATE TABLE IF NOT EXISTS exercise_definitions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        primary_muscle TEXT NOT NULL,
        secondary_muscles TEXT,
        description TEXT NOT NULL,
        instructions TEXT,
        common_mistakes TEXT,
        tips TEXT,
        image_url TEXT,
        is_custom INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,

      // Routines (workout templates)
      `CREATE TABLE IF NOT EXISTS routines (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        exercise_ids TEXT NOT NULL DEFAULT '[]',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        sync_status TEXT DEFAULT 'pending',
        last_sync_at INTEGER
      )`,

      // Routine exercises (configured exercises within a routine)
      `CREATE TABLE IF NOT EXISTS routine_exercises (
        id TEXT PRIMARY KEY,
        routine_id TEXT NOT NULL,
        exercise_definition_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('reps', 'time')),
        rest_between_sets_sec INTEGER,
        rest_after_exercise_sec INTEGER,
        timer_mode TEXT NOT NULL DEFAULT 'none' CHECK (timer_mode IN ('none', 'total', 'intervals')),
        total_duration_sec INTEGER,
        interval_set_sec INTEGER,
        interval_rest_sec INTEGER,
        unit TEXT NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'bodyweight', 'bands')),
        intensity_percent INTEGER,
        order_index INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_definition_id) REFERENCES exercise_definitions(id)
      )`,

      // Routine sets (individual set configurations)
      `CREATE TABLE IF NOT EXISTS routine_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routine_exercise_id TEXT NOT NULL,
        set_index INTEGER NOT NULL,
        target_reps INTEGER,
        target_time_sec INTEGER,
        weight_value REAL,
        weight_unit TEXT NOT NULL DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'bodyweight', 'bands')),
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (routine_exercise_id) REFERENCES routine_exercises(id) ON DELETE CASCADE,
        UNIQUE (routine_exercise_id, set_index)
      )`,

      // Create indexes for common queries
      `CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine_id 
       ON routine_exercises(routine_id)`,

      `CREATE INDEX IF NOT EXISTS idx_routine_sets_exercise_id 
       ON routine_sets(routine_exercise_id)`,

      `CREATE INDEX IF NOT EXISTS idx_exercise_definitions_muscle 
       ON exercise_definitions(primary_muscle)`,

      // Insert initial meta values
      `INSERT OR IGNORE INTO meta (key, value, updated_at) 
       VALUES ('db_version', '1', ${Date.now()})`,

      `INSERT OR IGNORE INTO meta (key, value, updated_at) 
       VALUES ('last_sync_at', '0', ${Date.now()})`,

      `INSERT OR IGNORE INTO meta (key, value, updated_at) 
       VALUES ('exercises_seeded', '0', ${Date.now()})`,
    ],
  },
];

/**
 * Get the latest migration version
 */
export function getLatestVersion(): number {
  return MIGRATIONS[MIGRATIONS.length - 1]?.version ?? 0;
}
