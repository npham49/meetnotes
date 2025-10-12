import { open, type DB } from '@op-engineering/op-sqlite';
import { migrations } from './migrations';

const DB_NAME = 'meetnotes.db';

let db: DB | null = null;
let syncMode: 'offline' | 'online' | null = null;

export async function initDatabase(mode?: 'offline' | 'online') {
  if (db) return db;

  if (mode) {
    syncMode = mode;
  }

  try {
    db = open({ name: DB_NAME });

    let currentVersion = 0;
    try {
      const result = await db.execute('SELECT MAX(version) as version FROM migrations');
      if (result.rows && result.rows.length > 0) {
        currentVersion = Number(result.rows[0].version) || 0;
      }
    } catch (error) {
      // migrations table doesn't exist yet
    }

    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        migration.up(db);
        db.execute('INSERT INTO migrations (version) VALUES (?)', [migration.version]);
      }
    }

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

export function getSyncMode(): 'offline' | 'online' | null {
  return syncMode;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    syncMode = null;
  }
}

export interface TursoSyncConfig {
  syncUrl: string;
  authToken: string;
  syncInterval?: number;
}

export function setupTursoSync(config: TursoSyncConfig) {
  const database = getDatabase();

  if (syncMode === 'offline') {
    return;
  }

  try {
    database.loadExtension('libsql');
    database.execute('PRAGMA libsql_sync_url = ?', [config.syncUrl]);
    database.execute('PRAGMA libsql_auth_token = ?', [config.authToken]);

    if (config.syncInterval) {
      setInterval(() => {
        try {
          syncNow();
        } catch (err) {
          console.error('Auto sync failed:', err);
        }
      }, config.syncInterval);
    }
  } catch (error) {
    console.error('Failed to setup Turso sync:', error);
    throw error;
  }
}

export function syncNow() {
  const database = getDatabase();

  if (syncMode === 'offline') {
    return;
  }

  try {
    database.execute('PRAGMA libsql_sync');
  } catch (error) {
    console.error('Manual sync failed:', error);
    throw error;
  }
}

export type {
  Category,
  VoiceSession,
  CategoryInsert,
  VoiceSessionInsert,
  CategoryUpdate,
  VoiceSessionUpdate,
} from './schema';
export { SCHEMA } from './schema';
