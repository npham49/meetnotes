# Service Layer Usage

## Category Service

```typescript
import {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/category.service';

// Create a new category
const newCategory = await createCategory({
  name: 'Work',
  description: 'Work related meetings',
  icon: 'briefcase',
});

// Get all categories
const categories = await getAllCategories();

// Get a single category
const category = await getOneCategory(1);

// Update a category
const updated = await updateCategory(1, {
  name: 'Personal',
  icon: 'user',
});

// Delete a category
const deleted = await deleteCategory(1);
console.log(deleted ? 'Deleted' : 'Not found');
```

## Voice Session Service

```typescript
import {
  createVoiceSession,
  getAllVoiceSessions,
  getOneVoiceSession,
  updateVoiceSession,
  deleteVoiceSession,
} from '@/lib/voiceSession.service';

// Create a new voice session
const newSession = await createVoiceSession({
  name: 'Team Meeting',
  transcript: 'Full transcript here...',
  summary: 'Discussed project roadmap',
});

// Get all voice sessions
const sessions = await getAllVoiceSessions();

// Get a single voice session
const session = await getOneVoiceSession(1);

// Update a voice session
const updated = await updateVoiceSession(1, {
  summary: 'Updated summary',
  transcript: 'Updated transcript',
});

// Delete a voice session
const deleted = await deleteVoiceSession(1);
console.log(deleted ? 'Deleted' : 'Not found');
```

## Using in React Components

```typescript
import { useEffect, useState } from 'react';
import { getAllCategories, type Category } from '@/lib/category.service';

export function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      {categories.map((category) => (
        <Text key={category.id}>{category.name}</Text>
      ))}
    </View>
  );
}
```

## Service Functions

### Category Service
- `createCategory(data)` - Create a new category
- `getAllCategories()` - Get all categories (ordered by creation date)
- `getOneCategory(id)` - Get a single category by ID (returns null if not found)
- `updateCategory(id, data)` - Update a category (returns updated category or null)
- `deleteCategory(id)` - Delete a category (returns true if deleted)

### Voice Session Service
- `createVoiceSession(data)` - Create a new voice session
- `getAllVoiceSessions()` - Get all voice sessions (ordered by creation date)
- `getOneVoiceSession(id)` - Get a single voice session by ID (returns null if not found)
- `updateVoiceSession(id, data)` - Update a voice session (returns updated session or null)
- `deleteVoiceSession(id)` - Delete a voice session (returns true if deleted)

## Type Safety

All functions are fully typed with TypeScript:
- Insert operations use `CategoryInsert` / `VoiceSessionInsert` (excludes auto-generated fields)
- Update operations use `Partial<CategoryInsert>` / `Partial<VoiceSessionInsert>` (all fields optional)
- Return types use full `Category` / `VoiceSession` interfaces
