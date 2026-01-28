/**
 * Database Configuration
 *
 * Constants and configuration for SQLite database.
 */

export const DATABASE_NAME = 'calcalcal.db';

export const DATABASE_VERSION = 1;

/**
 * Table names as constants to avoid typos
 */
export const TABLES = {
  ROUTINES: 'routines',
  ROUTINE_EXERCISES: 'routine_exercises',
  ROUTINE_SETS: 'routine_sets',
  EXERCISE_DEFINITIONS: 'exercise_definitions',
  META: 'meta',
} as const;
