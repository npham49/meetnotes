import { getDatabase, type VoiceSession, type VoiceSessionInsert } from '../lib/db';

/**
 * Voice Session Service
 * Provides CRUD operations for the VoiceSession table
 */

/**
 * Create a new voice session
 */
export async function createVoiceSession(data: VoiceSessionInsert): Promise<VoiceSession> {
  const db = getDatabase();

  const result = await db.execute(
    'INSERT INTO VoiceSession (name, transcript, summary) VALUES (?, ?, ?) RETURNING id',
    [data.name, data.transcript, data.summary]
  );

  const inserted = await db.execute('SELECT * FROM VoiceSession WHERE id = ?', [result.insertId!]);

  return inserted.rows![0] as unknown as VoiceSession;
}

/**
 * Get all voice sessions
 */
export async function getAllVoiceSessions(): Promise<VoiceSession[]> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM VoiceSession ORDER BY createdAt DESC');
  return (result.rows || []) as unknown as VoiceSession[];
}

/**
 * Get a single voice session by ID
 */
export async function getOneVoiceSession(id: number): Promise<VoiceSession | null> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM VoiceSession WHERE id = ?', [id]);

  if (!result.rows || result.rows.length === 0) {
    return null;
  }
  console.log('Fetched voice session:', result.rows[0]);

  return result.rows[0] as unknown as VoiceSession;
}

/**
 * Update a voice session
 */
export async function updateVoiceSession(
  id: number,
  data: Partial<VoiceSessionInsert>
): Promise<VoiceSession | null> {
  const db = getDatabase();

  const updates: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.transcript !== undefined) {
    updates.push('transcript = ?');
    values.push(data.transcript);
  }
  if (data.summary !== undefined) {
    updates.push('summary = ?');
    values.push(data.summary);
  }

  if (updates.length === 0) {
    return getOneVoiceSession(id);
  }

  updates.push("updatedAt = datetime('now')");
  values.push(id);

  await db.execute(`UPDATE VoiceSession SET ${updates.join(', ')} WHERE id = ?`, values);

  return getOneVoiceSession(id);
}

/**
 * Delete a voice session
 */
export async function deleteVoiceSession(id: number): Promise<boolean> {
  const db = getDatabase();
  const result = await db.execute('DELETE FROM VoiceSession WHERE id = ?', [id]);

  return (result.rowsAffected || 0) > 0;
}
