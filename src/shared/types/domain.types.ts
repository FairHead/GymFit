/**
 * Core Domain Types for CalCalCal
 *
 * @see ARCHITECTURE.md Section 4.2
 */

/**
 * Exercise Type - determines how the exercise is measured
 * - reps: counted repetitions (e.g., 10 push-ups)
 * - time: duration-based (e.g., 30 seconds plank)
 */
export type ExerciseType = 'reps' | 'time';

/**
 * Unit Type - weight/resistance measurement
 * - kg: kilogram weights (dumbbells, barbells)
 * - bodyweight: using own body weight
 * - bands: resistance bands
 */
export type UnitType = 'kg' | 'bodyweight' | 'bands';

/**
 * Timer Mode - how the timer behaves during exercise
 * - none: no automatic timer
 * - total: countdown for entire exercise duration
 * - intervals: repeating set + rest intervals
 */
export type TimerMode = 'none' | 'total' | 'intervals';

/**
 * Workout Run Status
 */
export type WorkoutRunStatus = 'active' | 'paused' | 'finished' | 'abandoned';

/**
 * Muscle Group for exercise categorization
 */
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'full-body';
