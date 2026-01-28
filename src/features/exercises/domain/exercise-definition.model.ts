/**
 * ExerciseDefinition Model
 *
 * Represents an exercise from the library (read-only reference data).
 * Contains metadata, instructions, and muscle group info.
 *
 * @see ARCHITECTURE.md Section 4.1
 * @see Konzept.md Section 8 & 9
 */
import { MuscleGroup } from '../../../shared/types/domain.types';

export interface ExerciseDefinition {
  /** Unique identifier */
  id: string;

  /** Exercise name (e.g., "Bench Press", "Plank") */
  name: string;

  /** Primary muscle group targeted */
  primaryMuscle: MuscleGroup;

  /** Secondary muscle groups involved */
  secondaryMuscles?: MuscleGroup[];

  /** Brief description of the exercise */
  description: string;

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

  /** Timestamp when created */
  createdAt: number;

  /** Timestamp when last updated */
  updatedAt: number;
}

/**
 * Create a new ExerciseDefinition with default values
 */
export function createExerciseDefinition(
  partial: Pick<ExerciseDefinition, 'id' | 'name' | 'primaryMuscle' | 'description'>
): ExerciseDefinition {
  const now = Date.now();
  return {
    ...partial,
    secondaryMuscles: [],
    isCustom: true,
    createdAt: now,
    updatedAt: now,
  };
}
