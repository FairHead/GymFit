/**
 * ExerciseDefinition Model
 *
 * Represents an exercise from the library (read-only reference data).
 * Contains metadata, instructions, and muscle group info.
 *
 * @see ARCHITECTURE.md Section 4.1
 * @see Konzept.md Section 8 & 9
 */
import { ExerciseType, MuscleGroup, UnitType } from '../../../shared/types/domain.types';

export interface ExerciseDefinition {
  /** Unique identifier */
  id: string;

  /** Exercise name (e.g., "Bench Press", "Plank") */
  name: string;

  /** German name for the exercise */
  nameDe?: string;

  /** Primary muscle group targeted */
  primaryMuscleGroup: MuscleGroup;

  /** Secondary muscle groups involved */
  secondaryMuscleGroups: MuscleGroup[];

  /** Default exercise type (reps or time) */
  defaultType: ExerciseType;

  /** Default unit for weight (kg, lbs, bodyweight) */
  defaultUnit: UnitType;

  /** Brief description of the exercise */
  description?: string;

  /** Step-by-step execution instructions */
  instructions?: string;

  /** Common mistakes to avoid */
  commonMistakes?: string;

  /** Tips for proper technique */
  tips?: string;

  /** Image URL or asset path */
  imageUrl?: string;

  /** Whether this is a custom user-created exercise */
  isCustom: boolean;

  /** Whether this exercise is active (not deleted) */
  isActive: boolean;

  /** Timestamp when created */
  createdAt: number;

  /** Timestamp when last updated */
  updatedAt: number;
}

/**
 * Create a new ExerciseDefinition with default values
 */
export function createExerciseDefinition(
  partial: Pick<ExerciseDefinition, 'id' | 'name' | 'primaryMuscleGroup'>
): ExerciseDefinition {
  const now = Date.now();
  return {
    ...partial,
    secondaryMuscleGroups: [],
    defaultType: 'reps',
    defaultUnit: 'kg',
    isCustom: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
}
