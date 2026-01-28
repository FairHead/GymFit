/**
 * useDatabase Hook
 *
 * React hook for initializing and managing database lifecycle.
 * Should be called once at app startup.
 *
 * @see ARCHITECTURE.md Section 5.1 SQLite
 */
import { useEffect, useState, useCallback } from 'react';
import { initDatabase } from '../../infra/db/database.service';
import { sqliteExerciseRepository } from '../../features/exercises/data/exercise.sqlite';
import { SEED_EXERCISES } from '../../features/exercises/data/seed-exercises';

interface DatabaseState {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to initialize and manage database
 *
 * @returns Database state and retry function
 */
export function useDatabase() {
  const [state, setState] = useState<DatabaseState>({
    isReady: false,
    isLoading: true,
    error: null,
  });

  const initialize = useCallback(async () => {
    setState({ isReady: false, isLoading: true, error: null });

    try {
      // Initialize database and run migrations
      await initDatabase();

      // Seed exercises if not already done
      await sqliteExerciseRepository.seedExercises(SEED_EXERCISES);

      setState({ isReady: true, isLoading: false, error: null });
    } catch (error) {
      console.error('Database initialization failed:', error);
      setState({
        isReady: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown database error'),
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const retry = useCallback(() => {
    initialize();
  }, [initialize]);

  return {
    ...state,
    retry,
  };
}
