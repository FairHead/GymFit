/**
 * WorkoutRun & Progress Models
 *
 * Represents an active workout session (execution of a Routine).
 * Tracks progress, completed sets, and actual values.
 *
 * @see ARCHITECTURE.md Section 4.2 WorkoutRun
 * @see Konzept.md Section 3.2 Workout-Run
 */
import { WorkoutRunStatus } from '../../../shared/types/domain.types';

/**
 * Actual set data captured during workout
 */
export interface ActualSet {
  /** Set index (matches SetPlan.index) */
  index: number;

  /** Actual reps performed (if reps-based) */
  actualReps?: number;

  /** Actual time in seconds (if time-based) */
  actualTimeSec?: number;

  /** Actual weight used */
  actualWeight?: number;

  /** Timestamp when set was completed */
  completedAt: number;
}

/**
 * Progress tracking for a single exercise within a workout run
 */
export interface RunExerciseProgress {
  /** Reference to RoutineExercise ID */
  routineExerciseId: string;

  /** Boolean array tracking completed sets (length = sets.length) */
  setsDone: boolean[];

  /** Optional: actual values for each completed set */
  actualSets?: ActualSet[];

  /** Whether this exercise was skipped */
  skipped?: boolean;

  /** Timestamp when exercise was started */
  startedAt?: number;

  /** Timestamp when exercise was completed */
  completedAt?: number;
}

/**
 * Timer state for the workout run
 */
export interface TimerState {
  /** Timestamp when timer was started */
  timerStartAt: number | null;

  /** Total duration in seconds */
  timerDurationSec: number;

  /** What the timer is counting (set duration or rest) */
  timerKind: 'set' | 'rest' | 'total' | null;

  /** Whether timer is paused */
  isPaused: boolean;

  /** Accumulated pause time in ms */
  pausedDuration: number;
}

/**
 * Active workout session
 */
export interface WorkoutRun {
  /** Unique identifier */
  id: string;

  /** Reference to the Routine being executed */
  routineId: string;

  /** Timestamp when workout started */
  startedAt: number;

  /** Timestamp when workout finished (if completed) */
  finishedAt?: number;

  /** Current exercise index (0-based) */
  currentExerciseIndex: number;

  /** Current set index within the exercise (0-based) */
  currentSetIndex: number;

  /** Progress for each exercise */
  exerciseProgress: RunExerciseProgress[];

  /** Current status */
  status: WorkoutRunStatus;

  /** Timer state */
  timer: TimerState;

  /** Total workout duration in seconds (calculated on finish) */
  totalDurationSec?: number;
}

/**
 * Create a new WorkoutRun for a routine
 */
export function createWorkoutRun(
  id: string,
  routineId: string,
  _exerciseCount: number
): WorkoutRun {
  const exerciseProgress: RunExerciseProgress[] = [];

  return {
    id,
    routineId,
    startedAt: Date.now(),
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    exerciseProgress,
    status: 'active',
    timer: {
      timerStartAt: null,
      timerDurationSec: 0,
      timerKind: null,
      isPaused: false,
      pausedDuration: 0,
    },
  };
}

/**
 * Initialize progress for a RoutineExercise
 */
export function createExerciseProgress(
  routineExerciseId: string,
  setCount: number
): RunExerciseProgress {
  return {
    routineExerciseId,
    setsDone: Array(setCount).fill(false),
    actualSets: [],
    skipped: false,
  };
}

/**
 * Calculate remaining time using timestamp-based approach
 * @see COPILOT-INSTRUCTIONS.md Section 6 Timer-Regeln
 */
export function calculateRemainingTime(timer: TimerState): number {
  if (!timer.timerStartAt || timer.timerKind === null) {
    return 0;
  }

  if (timer.isPaused) {
    // When paused, return the remaining time at pause
    const elapsed = timer.pausedDuration;
    return Math.max(0, timer.timerDurationSec - Math.floor(elapsed / 1000));
  }

  const now = Date.now();
  const elapsed = now - timer.timerStartAt - timer.pausedDuration;
  const remaining = timer.timerDurationSec - Math.floor(elapsed / 1000);

  return Math.max(0, remaining);
}
