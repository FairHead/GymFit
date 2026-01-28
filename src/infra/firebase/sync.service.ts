/**
 * SyncService Interface
 *
 * Defines the contract for Firebase synchronization.
 * Implements Last-Write-Wins conflict resolution via updatedAt.
 *
 * @see ARCHITECTURE.md Section 5.2 & 5.4 Sync
 * @see TASKS.md Phase 3.4
 */
import { Routine } from '../../features/routines/domain/routine.model';
import { RoutineExercise } from '../../features/routines/domain/routine-exercise.model';

export interface SyncResult {
  success: boolean;
  syncedAt: number;
  routinesPulled: number;
  routinesPushed: number;
  conflicts: SyncConflict[];
  error?: string;
}

export interface SyncConflict {
  routineId: string;
  localUpdatedAt: number;
  remoteUpdatedAt: number;
  resolution: 'local-wins' | 'remote-wins';
}

export interface SyncService {
  // Sync status
  getLastSyncAt(): Promise<number | null>;
  isOnline(): Promise<boolean>;

  // Manual sync
  syncNow(): Promise<SyncResult>;

  // Pull: Cloud → Local (if cloud is newer)
  pullRoutines(): Promise<Routine[]>;
  pullRoutineExercises(routineId: string): Promise<RoutineExercise[]>;

  // Push: Local → Cloud (if local is newer)
  pushRoutine(routine: Routine): Promise<void>;
  pushRoutineExercises(exercises: RoutineExercise[]): Promise<void>;

  // Delete sync
  deleteRoutineFromCloud(routineId: string): Promise<void>;

  // Auth state
  isAuthenticated(): boolean;
  getUserId(): string | null;
}
