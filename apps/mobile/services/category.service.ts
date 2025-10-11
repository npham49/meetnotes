import { getDatabase, type Category, type CategoryInsert } from './db';

/**
 * Category Service
 * Provides CRUD operations for the categories table
 */

/**
 * Create a new category
 */
export async function createCategory(data: CategoryInsert): Promise<Category> {
  const db = getDatabase();
  
  const result = await db.execute(
    'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)',
    [data.name, data.description, data.icon]
  );
  
  const inserted = await db.execute(
    'SELECT * FROM categories WHERE id = ?',
    [result.insertId!]
  );
  
  return inserted.rows![0] as unknown as Category;
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM categories ORDER BY createdAt DESC');
  return (result.rows || []) as unknown as Category[];
}

/**
 * Get a single category by ID
 */
export async function getOneCategory(id: number): Promise<Category | null> {
  const db = getDatabase();
  const result = await db.execute(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
  
  if (!result.rows || result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0] as unknown as Category;
}

/**
 * Update a category
 */
export async function updateCategory(
  id: number,
  data: Partial<CategoryInsert>
): Promise<Category | null> {
  const db = getDatabase();
  
  const updates: string[] = [];
  const values: any[] = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }
  if (data.icon !== undefined) {
    updates.push('icon = ?');
    values.push(data.icon);
  }
  
  if (updates.length === 0) {
    return getOneCategory(id);
  }
  
  updates.push("updatedAt = datetime('now')");
  values.push(id);
  
  await db.execute(
    `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  
  return getOneCategory(id);
}

/**
 * Delete a category
 */
export async function deleteCategory(id: number): Promise<boolean> {
  const db = getDatabase();
  const result = await db.execute(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );
  
  return (result.rowsAffected || 0) > 0;
}
