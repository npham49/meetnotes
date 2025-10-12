import type { DB } from '@op-engineering/op-sqlite';
import { SCHEMA } from './schema';

export interface Migration {
  version: number;
  name: string;
  up: (db: DB) => void;
}

// Helper to build CREATE TABLE statement from schema
function createTableSQL(tableName: string, columns: Record<string, string>): string {
  const columnDefs = Object.entries(columns)
    .map(([name, type]) => `${name} ${type}`)
    .join(',\n          ');

  return `CREATE TABLE IF NOT EXISTS ${tableName} (
          ${columnDefs}
        );`;
}

export const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: (db: DB) => {
      db.execute(createTableSQL(SCHEMA.categories.tableName, SCHEMA.categories.columns));
      db.execute(createTableSQL(SCHEMA.voiceSessions.tableName, SCHEMA.voiceSessions.columns));

      db.execute(`
        CREATE TABLE IF NOT EXISTS migrations (
          version INTEGER PRIMARY KEY,
          applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);
    },
  },
];
