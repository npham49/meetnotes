# Database Architecture

This project uses a **type-safe, migration-based** SQLite database setup with Turso offline sync.

## File Structure

```
lib/
├── schema.ts           # Source of truth for database types
├── migrations.ts       # Database migrations
├── db.ts              # Database initialization and connection
└── db-queries.example.ts  # Example CRUD operations
```

## Source of Truth Pattern

### 1. Define Schema Types First (`schema.ts`)

The TypeScript interfaces in `schema.ts` are the **single source of truth** for your database schema:

```typescript
export interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Define Schema Metadata

The `SCHEMA` constant maps TypeScript types to SQL column definitions:

```typescript
export const SCHEMA = {
  categories: {
    tableName: 'categories',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT NOT NULL',
      // ... other columns
    },
  },
} as const;
```

### 3. Migrations Use Schema (`migrations.ts`)

Migrations automatically generate SQL from the schema:

```typescript
export const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: (db: DB) => {
      db.execute(createTableSQL(SCHEMA.categories.tableName, SCHEMA.categories.columns));
    },
  },
];
```

## Adding New Migrations

### Step 1: Update Schema Types

Add or modify interfaces in `schema.ts`:

```typescript
export interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string;
  color: string; // NEW FIELD
  createdAt: string;
  updatedAt: string;
}
```

### Step 2: Update Schema Metadata (if needed)

Update `SCHEMA` constant in `schema.ts`:

```typescript
export const SCHEMA = {
  categories: {
    tableName: 'categories',
    columns: {
      // ... existing columns
      color: 'TEXT NOT NULL DEFAULT "#000000"', // NEW
    },
  },
} as const;
```

### Step 3: Add Migration

Add a new migration in `migrations.ts`:

```typescript
export const migrations: Migration[] = [
  // ... existing migrations
  {
    version: 2,
    name: 'add_category_color',
    up: (db: DB) => {
      db.execute('ALTER TABLE categories ADD COLUMN color TEXT NOT NULL DEFAULT "#000000"');
      console.log('Migration v2 applied: Added color column');
    },
  },
];
```

## Benefits of This Pattern

✅ **Type Safety**: TypeScript types ensure consistency across your app
✅ **Single Source**: Schema changes start with TypeScript types
✅ **Migration Tracking**: Automatic version control prevents duplicate migrations
✅ **Compile-Time Checks**: Catch schema mismatches before runtime
✅ **Self-Documenting**: Types serve as documentation

## Usage Example

```typescript
import { getDatabase, type Category, type CategoryInsert } from '@/lib/db';

// Insert with type safety
const newCategory: CategoryInsert = {
  name: 'Work',
  description: 'Work related notes',
  icon: 'briefcase',
};

const db = getDatabase();
await db.execute('INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)', [
  newCategory.name,
  newCategory.description,
  newCategory.icon,
]);
```

## Helper Types

The schema provides useful helper types:

- `CategoryInsert`: For inserts (excludes auto-generated fields)
- `CategoryUpdate`: For updates (all fields optional except id)
- `VoiceSessionInsert`: For voice session inserts
- `VoiceSessionUpdate`: For voice session updates

## Migration Process

1. App starts
2. `initDatabase()` is called in `_layout.tsx`
3. Current migration version is read from `migrations` table
4. Pending migrations are applied in order
5. Migration version is updated

## Best Practices

1. **Never modify existing migrations** - always add new ones
2. **Update schema types first** - let TypeScript guide your changes
3. **Test migrations** - always test migration paths
4. **Version carefully** - increment version numbers sequentially
5. **Document changes** - use descriptive migration names
