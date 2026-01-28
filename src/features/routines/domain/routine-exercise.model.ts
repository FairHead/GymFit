/**
 * RoutineExercise Model
 *
 * Represents a configured exercise within a Routine.
 * Contains all settings for sets, rest times, and timer behavior.
 *
 * @see ARCHITECTURE.md Section 4.2 RoutineExercise
 * @see Konzept.md Section 4 ExerciseCards
 */
import { ExerciseType, TimerMode, UnitType } from '../../../shared/types/domain.types';
import { SetPlan, createDefaultRepsSet } from './set-plan.model';

export interface RoutineExercise {
  /** Unique identifier within the routine */
  id: string;

  /** Parent routine ID */
  routineId: string;

  /** Reference to ExerciseDefinition */
  exerciseDefinitionId: string;

  /** Exercise type: reps OR time (mutually exclusive) */
  type: ExerciseType;

  /** Array of sets with individual configurations */
  sets: SetPlan[];

  /** Rest duration between sets (in seconds) */
  restBetweenSetsSec?: number;

  /** Rest duration after this exercise (in seconds) */
  restAfterExerciseSec?: number;

  /** Timer behavior mode */
  timerMode: TimerMode;

  /** Total exercise duration when timerMode is 'total' */
  totalDurationSec?: number;

  /** Set duration when timerMode is 'intervals' */
  intervalSetSec?: number;

  /** Rest duration when timerMode is 'intervals' */
  intervalRestSec?: number;

  /** Weight unit for this exercise */
  unit: UnitType;

  /** Optional intensity percentage (e.g., 75% of 1RM) */
  intensityPercent?: number;

  /** Order index within the routine */
  orderIndex: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_ROUTINE_EXERCISE_CONFIG = {
  setCount: 3,
  defaultReps: 8,
  defaultTimeSec: 30,
  defaultRestBetweenSetsSec: 90,
  defaultRestAfterExerciseSec: 120,
} as const;

/**
 * Create a new RoutineExercise with default values
 */
export function createRoutineExercise(
  id: string,
  routineId: string,
  exerciseDefinitionId: string,
  orderIndex: number,
  type: ExerciseType = 'reps'
): RoutineExercise {
  const { setCount, defaultReps } = DEFAULT_ROUTINE_EXERCISE_CONFIG;

  const sets: SetPlan[] = Array.from({ length: setCount }, (_, index) =>
    createDefaultRepsSet(index, defaultReps)
  );

  return {
    id,
    routineId,
    exerciseDefinitionId,
    type,
    sets,
    restBetweenSetsSec: DEFAULT_ROUTINE_EXERCISE_CONFIG.defaultRestBetweenSetsSec,
    restAfterExerciseSec: undefined,
    timerMode: 'none',
    unit: 'kg',
    orderIndex,
  };
}
