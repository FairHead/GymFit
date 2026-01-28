/**
 * Database Service
 *
 * Handles SQLite initialization, migrations, and provides
 * a singleton database instance.
 *
 * @see ARCHITECTURE.md Section 5.1 SQLite
 * @see TASKS.md Phase 2.1
 */
import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from './database.config';
import { MIGRATIONS, getLatestVersion } from './schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get or create the database instance
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // Enable foreign keys
  await dbInstance.execAsync('PRAGMA foreign_keys = ON');

  return dbInstance;
}

/**
 * Get current database version from meta table
 */
async function getCurrentVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  try {
    const result = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM meta WHERE key = 'db_version'"
    );
    return result ? parseInt(result.value, 10) : 0;
  } catch {
    // Table doesn't exist yet, version is 0
    return 0;
  }
}

/**
 * Update database version in meta table
 */
async function setVersion(db: SQLite.SQLiteDatabase, version: number): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO meta (key, value, updated_at) VALUES ('db_version', ?, ?)`,
    [version.toString(), Date.now()]
  );
}

/**
 * Run all pending migrations
 */
export async function migrate(): Promise<void> {
  const db = await getDatabase();
  const currentVersion = await getCurrentVersion(db);
  const latestVersion = getLatestVersion();

  if (currentVersion >= latestVersion) {
    console.warn(`Database is up to date (version ${currentVersion})`);
    return;
  }

  console.warn(`Migrating database from version ${currentVersion} to ${latestVersion}`);

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      console.warn(`Applying migration ${migration.version}: ${migration.description}`);

      await db.withTransactionAsync(async () => {
        for (const sql of migration.up) {
          await db.execAsync(sql);
        }
      });

      await setVersion(db, migration.version);
    }
  }

  console.warn('Database migration complete');
}

/**
 * Initialize database (call once at app start)
 */
export async function initDatabase(): Promise<void> {
  try {
    await migrate();
    console.warn('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Close database connection (for cleanup)
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}

/**
 * Get meta value by key
 */
export async function getMetaValue(key: string): Promise<string | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ value: string }>('SELECT value FROM meta WHERE key = ?', [
    key,
  ]);
  return result?.value ?? null;
}

/**
 * Set meta value
 */
export async function setMetaValue(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`INSERT OR REPLACE INTO meta (key, value, updated_at) VALUES (?, ?, ?)`, [
    key,
    value,
    Date.now(),
  ]);
}
