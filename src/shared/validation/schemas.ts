/**
 * Zod Validation Schemas
 *
 * Data validation for all domain models.
 * Used for runtime validation before database writes.
 *
 * @see ARCHITECTURE.md Section 6 Data Validation
 * @see TASKS.md Phase 2.4
 */
import { z } from 'zod';

// ==================== Enums ====================

export const exerciseTypeSchema = z.enum(['reps', 'time']);

export const unitTypeSchema = z.enum(['kg', 'lbs', 'bodyweight']);

export const timerModeSchema = z.enum(['standard', 'amrap', 'emom', 'interval']);

export const workoutRunStatusSchema = z.enum([
  'not_started',
  'in_progress',
  'paused',
  'completed',
  'cancelled',
]);

export const muscleGroupSchema = z.enum([
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'core',
  'full_body',
]);

export const syncStatusSchema = z.enum(['synced', 'pending', 'conflict']);

// ==================== SetPlan ====================

export const setPlanSchema = z
  .object({
    index: z.number().int().min(0),
    targetReps: z.number().int().min(1).optional(),
    targetTimeSec: z.number().int().min(1).optional(),
    weightValue: z.number().min(0).optional(),
    weightUnit: unitTypeSchema,
  })
  .refine((data) => data.targetReps !== undefined || data.targetTimeSec !== undefined, {
    message: 'SetPlan must have either targetReps or targetTimeSec',
  });

export type SetPlanInput = z.infer<typeof setPlanSchema>;

// ==================== RoutineExercise ====================

export const routineExerciseSchema = z.object({
  id: z.string().uuid(),
  routineId: z.string().uuid(),
  exerciseDefinitionId: z.string().min(1),
  type: exerciseTypeSchema,
  sets: z.array(setPlanSchema).min(1),
  restBetweenSetsSec: z.number().int().min(0).optional(),
  restAfterExerciseSec: z.number().int().min(0).optional(),
  timerMode: timerModeSchema,
  totalDurationSec: z.number().int().min(1).optional(),
  intervalSetSec: z.number().int().min(1).optional(),
  intervalRestSec: z.number().int().min(0).optional(),
  unit: unitTypeSchema,
  intensityPercent: z.number().min(0).max(100).optional(),
  orderIndex: z.number().int().min(0),
});

export type RoutineExerciseInput = z.infer<typeof routineExerciseSchema>;

// ==================== Routine ====================

export const routineSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  exerciseIds: z.array(z.string().uuid()),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
  syncStatus: syncStatusSchema.optional(),
  lastSyncAt: z.number().int().positive().optional(),
});

export type RoutineInput = z.infer<typeof routineSchema>;

// ==================== ExerciseDefinition ====================

export const exerciseDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  nameDe: z.string().max(100).optional(),
  primaryMuscleGroup: muscleGroupSchema,
  secondaryMuscleGroups: z.array(muscleGroupSchema),
  defaultType: exerciseTypeSchema,
  defaultUnit: unitTypeSchema,
  isCustom: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
});

export type ExerciseDefinitionInput = z.infer<typeof exerciseDefinitionSchema>;

// ==================== ActualSet (for WorkoutRun) ====================

export const actualSetSchema = z.object({
  index: z.number().int().min(0),
  plannedReps: z.number().int().min(1).optional(),
  plannedTimeSec: z.number().int().min(1).optional(),
  actualReps: z.number().int().min(0).optional(),
  actualTimeSec: z.number().int().min(0).optional(),
  weightValue: z.number().min(0).optional(),
  weightUnit: unitTypeSchema,
  isCompleted: z.boolean(),
  completedAt: z.number().int().positive().optional(),
  notes: z.string().max(500).optional(),
});

export type ActualSetInput = z.infer<typeof actualSetSchema>;

// ==================== TimerState ====================

export const timerStateSchema = z.object({
  isRunning: z.boolean(),
  startedAt: z.number().int().positive().optional(),
  pausedAt: z.number().int().positive().optional(),
  duration: z.number().int().min(0),
  type: z.enum(['exercise', 'rest', 'amrap', 'emom']),
});

export type TimerStateInput = z.infer<typeof timerStateSchema>;

// ==================== RunExerciseProgress ====================

export const runExerciseProgressSchema = z.object({
  routineExerciseId: z.string().uuid(),
  exerciseDefinitionId: z.string().min(1),
  type: exerciseTypeSchema,
  sets: z.array(actualSetSchema).min(1),
  currentSetIndex: z.number().int().min(0),
  isCompleted: z.boolean(),
  startedAt: z.number().int().positive().optional(),
  completedAt: z.number().int().positive().optional(),
  timer: timerStateSchema.optional(),
});

export type RunExerciseProgressInput = z.infer<typeof runExerciseProgressSchema>;

// ==================== WorkoutRun ====================

export const workoutRunSchema = z.object({
  id: z.string().uuid(),
  routineId: z.string().uuid(),
  status: workoutRunStatusSchema,
  startedAt: z.number().int().positive().optional(),
  completedAt: z.number().int().positive().optional(),
  pausedAt: z.number().int().positive().optional(),
  totalPausedDurationMs: z.number().int().min(0),
  exercises: z.array(runExerciseProgressSchema),
  currentExerciseIndex: z.number().int().min(0),
  notes: z.string().max(1000).optional(),
});

export type WorkoutRunInput = z.infer<typeof workoutRunSchema>;

// ==================== Validation Helpers ====================

/**
 * Validate data against a schema and return typed result
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Validate and throw on error
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Create a partial version of a schema for updates
 */
export function createPartialSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.partial();
}
