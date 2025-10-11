import { open, type DB } from '@op-engineering/op-sqlite';
import { migrations } from './migrations';

const DB_NAME = 'meetnotes.db';

let db: DB | null = null;

export async function initDatabase() {
  if (db) return db;

  try {
    // Open database
    db = open({ name: DB_NAME });
    console.log('Database opened successfully');

    // Get current schema version
    let currentVersion = 0;
    try {
      const result = await db.execute('SELECT MAX(version) as version FROM migrations');
      if (result.rows && result.rows.length > 0) {
        currentVersion = Number(result.rows[0].version) || 0;
      }
    } catch (error) {
      // migrations table doesn't exist yet
      console.log('No migrations table found, starting fresh');
    }

    // Apply pending migrations
    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        console.log(`Applying migration v${migration.version}...`);
        migration.up(db);
        db.execute('INSERT INTO migrations (version) VALUES (?)', [migration.version]);
      }
    }

    console.log('All migrations applied successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export function getDatabase(): DB {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('Database closed');
  }
}

// Turso Sync Configuration
export interface TursoSyncConfig {
  syncUrl: string;
  authToken: string;
  syncInterval?: number; // in milliseconds
}

export function setupTursoSync(config: TursoSyncConfig) {
  const database = getDatabase();

  try {
    // Configure Turso sync using libsql protocol
    database.loadExtension('libsql');
    database.execute('PRAGMA libsql_sync_url = ?', [config.syncUrl]);
    database.execute('PRAGMA libsql_auth_token = ?', [config.authToken]);

    if (config.syncInterval) {
      // Set up periodic sync
      setInterval(() => {
        try {
          syncNow();
        } catch (err) {
          console.error('Auto sync failed:', err);
        }
      }, config.syncInterval);
    }

    console.log('Turso sync configured successfully');
  } catch (error) {
    console.error('Failed to setup Turso sync:', error);
    throw error;
  }
}

export function syncNow() {
  const database = getDatabase();

  try {
    database.execute('PRAGMA libsql_sync');
    console.log('Manual sync completed');
  } catch (error) {
    console.error('Manual sync failed:', error);
    throw error;
  }
}

// Re-export schema types for convenience
export type {
  Category,
  VoiceSession,
  CategoryInsert,
  VoiceSessionInsert,
  CategoryUpdate,
  VoiceSessionUpdate,
} from './schema';
export { SCHEMA } from './schema';
