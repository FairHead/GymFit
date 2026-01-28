/**
 * ExerciseRepository Interface
 *
 * Defines the contract for exercise definition data operations.
 * This is primarily read-only with initial seeding.
 *
 * @see ARCHITECTURE.md Section 5 Persistence
 * @see Konzept.md Section 9 Übungsbibliothek
 */
import { ExerciseDefinition } from '../domain/exercise-definition.model';
import { MuscleGroup } from '../../../shared/types/domain.types';

export interface ExerciseRepository {
  // Read operations
  getAllExercises(): Promise<ExerciseDefinition[]>;
  getExerciseById(id: string): Promise<ExerciseDefinition | null>;
  getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Promise<ExerciseDefinition[]>;
  searchExercises(query: string): Promise<ExerciseDefinition[]>;

  // Seeding (for initial data population)
  seedExercises(exercises: ExerciseDefinition[]): Promise<void>;

  // Custom exercises (user-created)
  createCustomExercise(exercise: ExerciseDefinition): Promise<void>;
  updateExercise(exercise: ExerciseDefinition): Promise<void>;
  deleteExercise(id: string): Promise<void>;
}
