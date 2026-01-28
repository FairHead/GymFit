/**
 * SQLite Routine Repository Implementation
 *
 * Implements RoutineRepository interface for local SQLite storage.
 *
 * @see ARCHITECTURE.md Section 5.1 SQLite
 * @see TASKS.md Phase 2.3
 */
import { getDatabase } from '../../../infra/db/database.service';
import { TABLES } from '../../../infra/db/database.config';
import { Routine } from '../domain/routine.model';
import { RoutineExercise } from '../domain/routine-exercise.model';
import { SetPlan } from '../domain/set-plan.model';
import { RoutineRepository } from './routine.repository';
import { ExerciseType, TimerMode, UnitType } from '../../../shared/types/domain.types';

// Row types for database results
interface RoutineRow {
  id: string;
  title: string;
  description: string | null;
  exercise_ids: string;
  created_at: number;
  updated_at: number;
  sync_status: string | null;
  last_sync_at: number | null;
}

interface RoutineExerciseRow {
  id: string;
  routine_id: string;
  exercise_definition_id: string;
  type: string;
  rest_between_sets_sec: number | null;
  rest_after_exercise_sec: number | null;
  timer_mode: string;
  total_duration_sec: number | null;
  interval_set_sec: number | null;
  interval_rest_sec: number | null;
  unit: string;
  intensity_percent: number | null;
  order_index: number;
}

interface SetRow {
  id: number;
  routine_exercise_id: string;
  set_index: number;
  target_reps: number | null;
  target_time_sec: number | null;
  weight_value: number | null;
  weight_unit: string;
}

/**
 * Convert database row to Routine model
 */
function rowToRoutine(row: RoutineRow): Routine {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    exerciseIds: JSON.parse(row.exercise_ids) as string[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    syncStatus: (row.sync_status as Routine['syncStatus']) ?? undefined,
    lastSyncAt: row.last_sync_at ?? undefined,
  };
}

/**
 * Convert database row to RoutineExercise model
 */
function rowToRoutineExercise(row: RoutineExerciseRow, sets: SetPlan[]): RoutineExercise {
  return {
    id: row.id,
    routineId: row.routine_id,
    exerciseDefinitionId: row.exercise_definition_id,
    type: row.type as ExerciseType,
    sets,
    restBetweenSetsSec: row.rest_between_sets_sec ?? undefined,
    restAfterExerciseSec: row.rest_after_exercise_sec ?? undefined,
    timerMode: row.timer_mode as TimerMode,
    totalDurationSec: row.total_duration_sec ?? undefined,
    intervalSetSec: row.interval_set_sec ?? undefined,
    intervalRestSec: row.interval_rest_sec ?? undefined,
    unit: row.unit as UnitType,
    intensityPercent: row.intensity_percent ?? undefined,
    orderIndex: row.order_index,
  };
}

/**
 * Convert database row to SetPlan model
 */
function rowToSetPlan(row: SetRow): SetPlan {
  return {
    index: row.set_index,
    targetReps: row.target_reps ?? undefined,
    targetTimeSec: row.target_time_sec ?? undefined,
    weightValue: row.weight_value ?? undefined,
    weightUnit: row.weight_unit as UnitType,
  };
}

/**
 * SQLite implementation of RoutineRepository
 */
export const sqliteRoutineRepository: RoutineRepository = {
  // ==================== Routine CRUD ====================

  async getAllRoutines(): Promise<Routine[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<RoutineRow>(
      `SELECT * FROM ${TABLES.ROUTINES} ORDER BY updated_at DESC`
    );
    return rows.map(rowToRoutine);
  },

  async getRoutineById(id: string): Promise<Routine | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<RoutineRow>(
      `SELECT * FROM ${TABLES.ROUTINES} WHERE id = ?`,
      [id]
    );
    return row ? rowToRoutine(row) : null;
  },

  async createRoutine(routine: Routine): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO ${TABLES.ROUTINES} 
       (id, title, description, exercise_ids, created_at, updated_at, sync_status, last_sync_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        routine.id,
        routine.title,
        routine.description ?? null,
        JSON.stringify(routine.exerciseIds),
        routine.createdAt,
        routine.updatedAt,
        routine.syncStatus ?? 'pending',
        routine.lastSyncAt ?? null,
      ]
    );
  },

  async updateRoutine(routine: Routine): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE ${TABLES.ROUTINES} 
       SET title = ?, description = ?, exercise_ids = ?, updated_at = ?, sync_status = ?
       WHERE id = ?`,
      [
        routine.title,
        routine.description ?? null,
        JSON.stringify(routine.exerciseIds),
        Date.now(),
        'pending',
        routine.id,
      ]
    );
  },

  async deleteRoutine(id: string): Promise<void> {
    const db = await getDatabase();
    // CASCADE will handle routine_exercises and routine_sets
    await db.runAsync(`DELETE FROM ${TABLES.ROUTINES} WHERE id = ?`, [id]);
  },

  // ==================== RoutineExercise Operations ====================

  async getExercisesForRoutine(routineId: string): Promise<RoutineExercise[]> {
    const db = await getDatabase();

    const exerciseRows = await db.getAllAsync<RoutineExerciseRow>(
      `SELECT * FROM ${TABLES.ROUTINE_EXERCISES} 
       WHERE routine_id = ? 
       ORDER BY order_index`,
      [routineId]
    );

    const exercises: RoutineExercise[] = [];

    for (const row of exerciseRows) {
      const setRows = await db.getAllAsync<SetRow>(
        `SELECT * FROM ${TABLES.ROUTINE_SETS} 
         WHERE routine_exercise_id = ? 
         ORDER BY set_index`,
        [row.id]
      );

      const sets = setRows.map(rowToSetPlan);
      exercises.push(rowToRoutineExercise(row, sets));
    }

    return exercises;
  },

  async addExerciseToRoutine(exercise: RoutineExercise): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();

    await db.withTransactionAsync(async () => {
      // Insert routine exercise
      await db.runAsync(
        `INSERT INTO ${TABLES.ROUTINE_EXERCISES}
         (id, routine_id, exercise_definition_id, type, rest_between_sets_sec, 
          rest_after_exercise_sec, timer_mode, total_duration_sec, interval_set_sec,
          interval_rest_sec, unit, intensity_percent, order_index, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          exercise.id,
          exercise.routineId,
          exercise.exerciseDefinitionId,
          exercise.type,
          exercise.restBetweenSetsSec ?? null,
          exercise.restAfterExerciseSec ?? null,
          exercise.timerMode,
          exercise.totalDurationSec ?? null,
          exercise.intervalSetSec ?? null,
          exercise.intervalRestSec ?? null,
          exercise.unit,
          exercise.intensityPercent ?? null,
          exercise.orderIndex,
          now,
          now,
        ]
      );

      // Insert sets
      for (const set of exercise.sets) {
        await db.runAsync(
          `INSERT INTO ${TABLES.ROUTINE_SETS}
           (routine_exercise_id, set_index, target_reps, target_time_sec, 
            weight_value, weight_unit, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            exercise.id,
            set.index,
            set.targetReps ?? null,
            set.targetTimeSec ?? null,
            set.weightValue ?? null,
            set.weightUnit,
            now,
            now,
          ]
        );
      }

      // Update routine's exercise_ids array
      const routine = await db.getFirstAsync<RoutineRow>(
        `SELECT * FROM ${TABLES.ROUTINES} WHERE id = ?`,
        [exercise.routineId]
      );

      if (routine) {
        const exerciseIds = JSON.parse(routine.exercise_ids) as string[];
        exerciseIds.push(exercise.id);

        await db.runAsync(
          `UPDATE ${TABLES.ROUTINES} 
           SET exercise_ids = ?, updated_at = ?, sync_status = 'pending'
           WHERE id = ?`,
          [JSON.stringify(exerciseIds), now, exercise.routineId]
        );
      }
    });
  },

  async updateRoutineExercise(exercise: RoutineExercise): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();

    await db.withTransactionAsync(async () => {
      // Update routine exercise
      await db.runAsync(
        `UPDATE ${TABLES.ROUTINE_EXERCISES}
         SET type = ?, rest_between_sets_sec = ?, rest_after_exercise_sec = ?,
             timer_mode = ?, total_duration_sec = ?, interval_set_sec = ?,
             interval_rest_sec = ?, unit = ?, intensity_percent = ?, 
             order_index = ?, updated_at = ?
         WHERE id = ?`,
        [
          exercise.type,
          exercise.restBetweenSetsSec ?? null,
          exercise.restAfterExerciseSec ?? null,
          exercise.timerMode,
          exercise.totalDurationSec ?? null,
          exercise.intervalSetSec ?? null,
          exercise.intervalRestSec ?? null,
          exercise.unit,
          exercise.intensityPercent ?? null,
          exercise.orderIndex,
          now,
          exercise.id,
        ]
      );

      // Delete existing sets and re-insert
      await db.runAsync(`DELETE FROM ${TABLES.ROUTINE_SETS} WHERE routine_exercise_id = ?`, [
        exercise.id,
      ]);

      for (const set of exercise.sets) {
        await db.runAsync(
          `INSERT INTO ${TABLES.ROUTINE_SETS}
           (routine_exercise_id, set_index, target_reps, target_time_sec, 
            weight_value, weight_unit, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            exercise.id,
            set.index,
            set.targetReps ?? null,
            set.targetTimeSec ?? null,
            set.weightValue ?? null,
            set.weightUnit,
            now,
            now,
          ]
        );
      }

      // Update parent routine's updated_at
      await db.runAsync(
        `UPDATE ${TABLES.ROUTINES} 
         SET updated_at = ?, sync_status = 'pending'
         WHERE id = ?`,
        [now, exercise.routineId]
      );
    });
  },

  async removeExerciseFromRoutine(exerciseId: string): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();

    // Get the exercise first to find routine_id
    const exercise = await db.getFirstAsync<RoutineExerciseRow>(
      `SELECT * FROM ${TABLES.ROUTINE_EXERCISES} WHERE id = ?`,
      [exerciseId]
    );

    if (!exercise) return;

    await db.withTransactionAsync(async () => {
      // CASCADE will handle routine_sets
      await db.runAsync(`DELETE FROM ${TABLES.ROUTINE_EXERCISES} WHERE id = ?`, [exerciseId]);

      // Update routine's exercise_ids array
      const routine = await db.getFirstAsync<RoutineRow>(
        `SELECT * FROM ${TABLES.ROUTINES} WHERE id = ?`,
        [exercise.routine_id]
      );

      if (routine) {
        const exerciseIds = (JSON.parse(routine.exercise_ids) as string[]).filter(
          (id) => id !== exerciseId
        );

        await db.runAsync(
          `UPDATE ${TABLES.ROUTINES} 
           SET exercise_ids = ?, updated_at = ?, sync_status = 'pending'
           WHERE id = ?`,
          [JSON.stringify(exerciseIds), now, exercise.routine_id]
        );
      }
    });
  },

  // ==================== Reordering ====================

  async reorderExercises(routineId: string, exerciseIds: string[]): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();

    await db.withTransactionAsync(async () => {
      // Update order_index for each exercise
      for (let i = 0; i < exerciseIds.length; i++) {
        await db.runAsync(
          `UPDATE ${TABLES.ROUTINE_EXERCISES} 
           SET order_index = ?, updated_at = ?
           WHERE id = ?`,
          [i, now, exerciseIds[i]]
        );
      }

      // Update routine's exercise_ids array
      await db.runAsync(
        `UPDATE ${TABLES.ROUTINES} 
         SET exercise_ids = ?, updated_at = ?, sync_status = 'pending'
         WHERE id = ?`,
        [JSON.stringify(exerciseIds), now, routineId]
      );
    });
  },

  // ==================== Sync Support ====================

  async getRoutinesUpdatedSince(timestamp: number): Promise<Routine[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<RoutineRow>(
      `SELECT * FROM ${TABLES.ROUTINES} WHERE updated_at > ?`,
      [timestamp]
    );
    return rows.map(rowToRoutine);
  },

  async markAsSynced(routineId: string, syncTimestamp: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE ${TABLES.ROUTINES} 
       SET sync_status = 'synced', last_sync_at = ?
       WHERE id = ?`,
      [syncTimestamp, routineId]
    );
  },
};
