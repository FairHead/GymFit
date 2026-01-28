/**
 * RoutineRepository Interface
 *
 * Defines the contract for routine data operations.
 * Implementations: SQLite (local), Firebase (remote sync)
 *
 * @see ARCHITECTURE.md Section 5 Persistence
 */
import { Routine } from '../domain/routine.model';
import { RoutineExercise } from '../domain/routine-exercise.model';

export interface RoutineRepository {
  // Routine CRUD
  getAllRoutines(): Promise<Routine[]>;
  getRoutineById(id: string): Promise<Routine | null>;
  createRoutine(routine: Routine): Promise<void>;
  updateRoutine(routine: Routine): Promise<void>;
  deleteRoutine(id: string): Promise<void>;

  // RoutineExercise operations
  getExercisesForRoutine(routineId: string): Promise<RoutineExercise[]>;
  addExerciseToRoutine(exercise: RoutineExercise): Promise<void>;
  updateRoutineExercise(exercise: RoutineExercise): Promise<void>;
  removeExerciseFromRoutine(exerciseId: string): Promise<void>;

  // Reordering
  reorderExercises(routineId: string, exerciseIds: string[]): Promise<void>;

  // Sync support
  getRoutinesUpdatedSince(timestamp: number): Promise<Routine[]>;
  markAsSynced(routineId: string, syncTimestamp: number): Promise<void>;
}
