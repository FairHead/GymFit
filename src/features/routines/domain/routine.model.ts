/**
 * Routine Model
 *
 * Represents a workout routine template that can be reused.
 * Contains metadata and ordered list of exercise IDs.
 *
 * @see ARCHITECTURE.md Section 4.2 Routine
 * @see Konzept.md Section 3.1 Routine
 */

export interface Routine {
  /** Unique identifier */
  id: string;

  /** Routine name (e.g., "Push Day", "Full Body") */
  title: string;

  /** Optional description */
  description?: string;

  /** Ordered list of RoutineExercise IDs */
  exerciseIds: string[];

  /** Timestamp when created */
  createdAt: number;

  /** Timestamp when last updated */
  updatedAt: number;

  /** Sync status for Firebase */
  syncStatus?: 'synced' | 'pending' | 'conflict';

  /** Last sync timestamp */
  lastSyncAt?: number;
}

/**
 * Create a new Routine with default values
 */
export function createRoutine(id: string, title: string, description?: string): Routine {
  const now = Date.now();
  return {
    id,
    title,
    description,
    exerciseIds: [],
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending',
  };
}

/**
 * Create a duplicate of an existing routine
 */
export function duplicateRoutine(routine: Routine, newId: string, newTitle?: string): Routine {
  const now = Date.now();
  return {
    ...routine,
    id: newId,
    title: newTitle ?? `${routine.title} (Kopie)`,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending',
    lastSyncAt: undefined,
  };
}
