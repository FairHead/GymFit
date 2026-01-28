/**
 * SQLite Exercise Repository Implementation
 *
 * Implements ExerciseRepository interface for local SQLite storage.
 * Handles exercise definitions including seed data.
 *
 * @see ARCHITECTURE.md Section 5.1 SQLite
 * @see TASKS.md Phase 2.3
 */
import { getDatabase, getMetaValue, setMetaValue } from '../../../infra/db/database.service';
import { TABLES } from '../../../infra/db/database.config';
import { ExerciseDefinition } from '../domain/exercise-definition.model';
import { ExerciseRepository } from './exercise.repository';
import { ExerciseType, MuscleGroup, UnitType } from '../../../shared/types/domain.types';

// Row type for database results
interface ExerciseDefinitionRow {
  id: string;
  name: string;
  name_de: string | null;
  primary_muscle_group: string;
  secondary_muscle_groups: string;
  default_type: string;
  default_unit: string;
  is_custom: number;
  is_active: number;
  created_at: number;
  updated_at: number;
}

/**
 * Convert database row to ExerciseDefinition model
 */
function rowToExerciseDefinition(row: ExerciseDefinitionRow): ExerciseDefinition {
  return {
    id: row.id,
    name: row.name,
    nameDe: row.name_de ?? undefined,
    primaryMuscleGroup: row.primary_muscle_group as MuscleGroup,
    secondaryMuscleGroups: JSON.parse(row.secondary_muscle_groups) as MuscleGroup[],
    defaultType: row.default_type as ExerciseType,
    defaultUnit: row.default_unit as UnitType,
    isCustom: row.is_custom === 1,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * SQLite implementation of ExerciseRepository
 */
export const sqliteExerciseRepository: ExerciseRepository = {
  async getAllExercises(): Promise<ExerciseDefinition[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<ExerciseDefinitionRow>(
      `SELECT * FROM ${TABLES.EXERCISE_DEFINITIONS} WHERE is_active = 1 ORDER BY name`
    );
    return rows.map(rowToExerciseDefinition);
  },

  async getExerciseById(id: string): Promise<ExerciseDefinition | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<ExerciseDefinitionRow>(
      `SELECT * FROM ${TABLES.EXERCISE_DEFINITIONS} WHERE id = ?`,
      [id]
    );
    return row ? rowToExerciseDefinition(row) : null;
  },

  async getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Promise<ExerciseDefinition[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<ExerciseDefinitionRow>(
      `SELECT * FROM ${TABLES.EXERCISE_DEFINITIONS} 
       WHERE is_active = 1 AND (
         primary_muscle_group = ? 
         OR secondary_muscle_groups LIKE ?
       )
       ORDER BY name`,
      [muscleGroup, `%"${muscleGroup}"%`]
    );
    return rows.map(rowToExerciseDefinition);
  },

  async searchExercises(query: string): Promise<ExerciseDefinition[]> {
    const db = await getDatabase();
    const searchPattern = `%${query}%`;
    const rows = await db.getAllAsync<ExerciseDefinitionRow>(
      `SELECT * FROM ${TABLES.EXERCISE_DEFINITIONS} 
       WHERE is_active = 1 AND (
         name LIKE ? 
         OR name_de LIKE ?
         OR primary_muscle_group LIKE ?
       )
       ORDER BY name`,
      [searchPattern, searchPattern, searchPattern]
    );
    return rows.map(rowToExerciseDefinition);
  },

  async seedExercises(exercises: ExerciseDefinition[]): Promise<void> {
    // Check if already seeded
    const seeded = await getMetaValue('exercises_seeded');
    if (seeded === '1') {
      return;
    }

    const db = await getDatabase();
    const now = Date.now();

    await db.withTransactionAsync(async () => {
      for (const exercise of exercises) {
        await db.runAsync(
          `INSERT OR IGNORE INTO ${TABLES.EXERCISE_DEFINITIONS}
           (id, name, name_de, primary_muscle_group, secondary_muscle_groups,
            default_type, default_unit, is_custom, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            exercise.id,
            exercise.name,
            exercise.nameDe ?? null,
            exercise.primaryMuscleGroup,
            JSON.stringify(exercise.secondaryMuscleGroups),
            exercise.defaultType,
            exercise.defaultUnit,
            0, // is_custom = false for seed data
            1, // is_active = true
            now,
            now,
          ]
        );
      }

      // Mark as seeded
      await setMetaValue('exercises_seeded', '1');
    });
  },

  async createCustomExercise(exercise: ExerciseDefinition): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();

    await db.runAsync(
      `INSERT INTO ${TABLES.EXERCISE_DEFINITIONS}
       (id, name, name_de, primary_muscle_group, secondary_muscle_groups,
        default_type, default_unit, is_custom, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        exercise.id,
        exercise.name,
        exercise.nameDe ?? null,
        exercise.primaryMuscleGroup,
        JSON.stringify(exercise.secondaryMuscleGroups),
        exercise.defaultType,
        exercise.defaultUnit,
        1, // is_custom = true
        1, // is_active = true
        now,
        now,
      ]
    );
  },

  async updateExercise(exercise: ExerciseDefinition): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();

    await db.runAsync(
      `UPDATE ${TABLES.EXERCISE_DEFINITIONS}
       SET name = ?, name_de = ?, primary_muscle_group = ?, secondary_muscle_groups = ?,
           default_type = ?, default_unit = ?, is_active = ?, updated_at = ?
       WHERE id = ?`,
      [
        exercise.name,
        exercise.nameDe ?? null,
        exercise.primaryMuscleGroup,
        JSON.stringify(exercise.secondaryMuscleGroups),
        exercise.defaultType,
        exercise.defaultUnit,
        exercise.isActive ? 1 : 0,
        now,
        exercise.id,
      ]
    );
  },

  async deleteExercise(id: string): Promise<void> {
    const db = await getDatabase();

    // Soft delete by setting is_active = false
    await db.runAsync(
      `UPDATE ${TABLES.EXERCISE_DEFINITIONS} 
       SET is_active = 0, updated_at = ?
       WHERE id = ?`,
      [Date.now(), id]
    );
  },
};
