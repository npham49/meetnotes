# Database Offline/Online Configuration

## Summary of Changes

The database system has been updated to properly respect the offline/online mode selected during onboarding.

## Key Changes

### `lib/db.ts`

**Added:**

- `syncMode` tracking variable
- `initDatabase(mode?)` - Now accepts optional mode parameter
- `getSyncMode()` - Returns current database sync mode
- Safety checks in `setupTursoSync()` and `syncNow()` to prevent Turso operations in offline mode

**Behavior:**

```typescript
// Offline mode
initDatabase('offline')
// → Opens local SQLite database
// → NO Turso sync configured
// → NO external connections
// → 100% local storage

// Online mode (future)
initDatabase('online')
setupTursoSync({ ... })
// → Opens local SQLite database
// → Configures Turso sync
// → Enables cloud backup
```

### `app/_layout.tsx`

**Updated initialization:**

```typescript
if (syncMode === 'offline') {
  await initDatabase('offline');
  // Pure local database - no sync
}

if (syncMode === 'online') {
  await initDatabase('online');
  // TODO: Setup Turso sync after authentication
  // setupTursoSync({ syncUrl, authToken });
}
```

## Verification

### Offline Mode Guarantees ✅

1. No `setupTursoSync()` is called
2. No Turso extensions loaded
3. No external network connections
4. Pure SQLite local file storage
5. Data never leaves device

### Console Logs

When running in offline mode, you'll see:

```
Initializing database in offline mode
Database opened successfully
All migrations applied successfully
Running in OFFLINE mode - no cloud sync
Database initialized in OFFLINE mode - local storage only
```

### Testing Offline Mode

1. Complete onboarding, select "Offline Mode"
2. Check console logs for "OFFLINE mode" messages
3. Verify no Turso-related errors
4. Database operations work normally
5. Data persists across app restarts

### Testing Future Online Mode

1. When enabled, select "Online Sync"
2. Database initializes with 'online' mode
3. After authentication, call `setupTursoSync()`
4. Verify sync operations work

## Security Notes

**Offline Mode:**

- All data stored locally in SQLite file
- No credentials needed
- No cloud connections
- Private by default

**Online Mode (Future):**

- Requires user authentication
- Turso credentials stored securely
- Data encrypted in transit
- User controls sync timing

## API Changes

### Before

```typescript
initDatabase(); // Always initialized the same way
```

### After

```typescript
initDatabase('offline'); // Pure local
initDatabase('online'); // With sync capability
setupTursoSync(config); // Explicitly enable sync
```

## Migration Path

Existing apps will continue to work. The mode parameter is optional:

```typescript
initDatabase(); // Works, defaults to basic init
initDatabase('offline'); // Explicit offline mode (recommended)
```

## Developer Testing

To test both modes:

```typescript
// Reset and test offline
import { clearOnboardingData } from '@/lib/storage.service';
await clearOnboardingData();
// Restart app, select "Offline Mode"

// Future: Test online
// Select "Online Sync", login, verify sync
```

## Files Modified

- ✅ `lib/db.ts` - Added mode tracking and safety checks
- ✅ `app/_layout.tsx` - Explicit mode initialization
- ✅ `ONBOARDING.md` - Updated documentation

All changes are backward compatible and type-safe!
