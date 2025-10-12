# Onboarding Feature

## Overview

First-time users are presented with an onboarding screen to choose their storage mode:

- **Offline Mode** (Active): Local SQLite database only - NO cloud sync
- **Online Sync** (Disabled): Coming soon - requires account login

## Important: Database Modes

### Offline Mode (Current Default)

- Pure local SQLite database
- No Turso sync configured
- No external connections
- 100% private and local
- Works without internet
- Data stays on device only

### Online Mode (Future)

- Local SQLite database
- Turso sync enabled (requires authentication)
- Data synced to cloud
- Requires internet for sync
- Cross-device access

## Files Created

### `lib/storage.service.ts`

Manages persistent app settings using AsyncStorage:

- `hasCompletedOnboarding()` - Check if user has completed onboarding
- `setOnboardingComplete()` - Mark onboarding as complete
- `getSyncMode()` - Get current sync mode ('offline' | 'online')
- `setSyncMode(mode)` - Set sync mode
- `clearOnboardingData()` - Reset onboarding (useful for testing)

### `app/onboarding.tsx`

Beautiful onboarding screen with:

- Two mode options (offline active, online disabled)
- Visual selection state
- Feature highlights for each mode
- "Coming Soon" badge on online option
- Continue button (only enabled when offline is selected)

### `app/home.tsx`

Main home screen after onboarding:

- Placeholder UI for future features
- Shows user is ready to use the app

### Updated Files

**`app/_layout.tsx`**

- Checks onboarding completion on startup
- Initializes database with explicit mode parameter
- **OFFLINE mode**: Pure local SQLite, no Turso sync
- **ONLINE mode**: Turso sync configured (when implemented)
- Shows nothing until ready (prevents flash)

**`app/index.tsx`**

- Entry point that checks onboarding status
- Redirects to `/onboarding` if not complete
- Redirects to `/home` if complete
- Shows loading spinner during check

## User Flow

```
App Start (index.tsx)
    ↓
Check Onboarding Complete?
    ↓
  ┌─NO─→ onboarding.tsx
  │         ↓
  │     Select Offline
  │         ↓
  │     Save Choice
  │         ↓
  └──YES─→ home.tsx
```

## Testing/Development

To reset onboarding (test the flow again):

```typescript
import { clearOnboardingData } from '@/lib/storage.service';

// In your component or dev menu
await clearOnboardingData();
// Then restart app
```

## Storage Keys

Data is stored in AsyncStorage:

- `@meetnotes:onboarding_complete` - Boolean flag
- `@meetnotes:sync_mode` - 'offline' or 'online'

## Future: Online Sync

When implementing online sync:

1. Remove the disabled state from online option in `onboarding.tsx`
2. Add authentication flow before allowing online selection
3. Call `setupTursoSync()` in `_layout.tsx` after successful auth
4. Add account management UI

```typescript
// In _layout.tsx after initDatabase('online')
if (syncMode === 'online' && userIsAuthenticated) {
  setupTursoSync({
    syncUrl: userTursoUrl,
    authToken: userAuthToken,
    syncInterval: 60000, // Optional auto-sync
  });
}
```

**Key Points:**

- `initDatabase()` now accepts mode parameter: `'offline'` | `'online'`
- `setupTursoSync()` checks sync mode and won't run in offline mode
- `syncNow()` is blocked in offline mode
- Database tracks current mode via `getSyncMode()`

## UI Features

- **Dark mode support**: Adapts to system theme
- **Accessible**: Proper contrast and touch targets
- **Responsive**: Works on all screen sizes
- **Smooth transitions**: Visual feedback on selection
- **Feature badges**: Quick benefit highlights

## Notes

- Onboarding only shows once per installation
- Choice persists across app restarts
- User can change mode later in settings (to be implemented)
- Database initialization is deferred until mode is selected
- Works offline-first by default
