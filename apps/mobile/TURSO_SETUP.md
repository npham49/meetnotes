# Turso Offline Sync Setup

This app uses Turso offline sync for local-first database functionality.

## Prerequisites

1. Create a Turso account at https://turso.tech
2. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`

## Setup Steps

### 1. Create a Turso Database

```bash
turso db create meetnotes
```

### 2. Get Database URL

```bash
turso db show meetnotes --url
```

### 3. Create an Auth Token

```bash
turso db tokens create meetnotes
```

### 4. Configure in Your App

Add to your app initialization (e.g., in `app/_layout.tsx` or environment):

```typescript
import { setupTursoSync } from '@/lib/db';

// After initDatabase()
setupTursoSync({
  syncUrl: 'libsql://your-database.turso.io',
  authToken: 'your-auth-token',
  syncInterval: 60000, // Sync every 60 seconds (optional)
});
```

### 5. Manual Sync

You can trigger manual sync anytime:

```typescript
import { syncNow } from '@/lib/db';

// Trigger sync
syncNow();
```

## Environment Variables (Recommended)

Store credentials securely using environment variables:

1. Install dotenv: `npm install react-native-dotenv`
2. Create `.env`:

```
TURSO_SYNC_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

3. Add to `.gitignore`:

```
.env
```

## Schema Sync

Initial schema is automatically applied locally. To sync schema to Turso:

```bash
turso db shell meetnotes < schema.sql
```

Or manually create tables in Turso dashboard matching your local schema.

## Notes

- The database works offline-first
- Changes sync automatically based on `syncInterval`
- If sync fails, app continues to work locally
- Conflicts are handled by Turso's CRDT logic
