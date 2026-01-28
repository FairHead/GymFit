/**
 * SetPlan Model
 *
 * Represents a single set within a RoutineExercise.
 * Contains target values (reps OR time) and optional weight.
 *
 * @see ARCHITECTURE.md Section 4.2 SetPlan
 */
import { UnitType } from '../../../shared/types/domain.types';

export interface SetPlan {
  /** Set index (0-based) */
  index: number;

  /** Target repetitions (only if exercise type is 'reps') */
  targetReps?: number;

  /** Target duration in seconds (only if exercise type is 'time') */
  targetTimeSec?: number;

  /** Weight value (optional) */
  weightValue?: number;

  /** Weight unit */
  weightUnit: UnitType;
}

/**
 * Create a default SetPlan for reps-based exercise
 */
export function createDefaultRepsSet(index: number, reps = 8): SetPlan {
  return {
    index,
    targetReps: reps,
    weightValue: undefined,
    weightUnit: 'kg',
  };
}

/**
 * Create a default SetPlan for time-based exercise
 */
export function createDefaultTimeSet(index: number, timeSec = 30): SetPlan {
  return {
    index,
    targetTimeSec: timeSec,
    weightValue: undefined,
    weightUnit: 'bodyweight',
  };
}
