// Database Schema Types - Source of Truth

export interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceSession {
  id: number;
  name: string;
  transcript: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

// Helper type for inserts (excludes auto-generated fields)
export type CategoryInsert = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type VoiceSessionInsert = Omit<VoiceSession, 'id' | 'createdAt' | 'updatedAt'>;

// Helper type for updates (all fields optional except id)
export type CategoryUpdate = Partial<Omit<Category, 'id'>> & { id: number };
export type VoiceSessionUpdate = Partial<Omit<VoiceSession, 'id'>> & { id: number };

// Database schema metadata
export const SCHEMA = {
  categories: {
    tableName: 'categories',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT NOT NULL',
      description: 'TEXT',
      icon: 'TEXT NOT NULL',
      createdAt: "TEXT NOT NULL DEFAULT (datetime('now'))",
      updatedAt: "TEXT NOT NULL DEFAULT (datetime('now'))",
    },
  },
  voiceSessions: {
    tableName: 'VoiceSession',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT NOT NULL',
      transcript: 'TEXT',
      summary: 'TEXT',
      createdAt: "TEXT NOT NULL DEFAULT (datetime('now'))",
      updatedAt: "TEXT NOT NULL DEFAULT (datetime('now'))",
    },
  },
} as const;
