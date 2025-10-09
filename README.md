# meetnotes

A monorepo project for MeetNotes, containing a Hono server and React Native mobile app, managed with Bun workspaces.

## Project Structure

```
meetnotes/
├── apps/
│   ├── server/          # Hono API server
│   └── mobile/          # React Native mobile app (Expo)
├── packages/            # Shared packages (optional)
└── package.json         # Root workspace configuration
```

## Prerequisites

- [Bun](https://bun.sh) (v1.2.23 or later)
- Node.js (for Expo/React Native)
- For mobile development:
  - Android Studio (for Android)
  - Xcode (for iOS, macOS only)
  - Or Expo Go app on your phone

## Getting Started

### Installation

```bash
# Install all dependencies
bun install
```

### Development

```bash
# Run server in development mode
bun run server:dev

# Run mobile app in development mode
bun run mobile:dev

# Run both simultaneously (in separate terminals)
bun run server:dev
bun run mobile:dev
```

### Build

```bash
# Build server
cd apps/server
bun run build

# For mobile, use Expo build service
cd apps/mobile
npx expo build
```

## Apps

### Server (apps/server)

Hono-based API server providing backend services for MeetNotes.

- **Tech Stack**: Hono, Bun, TypeScript
- **Port**: 3000 (default)
- **Endpoints**:
  - `GET /` - Welcome message
  - `GET /health` - Health check
  - `GET /api/notes` - Get all notes
  - `POST /api/notes` - Create a new note

See [apps/server/README.md](apps/server/README.md) for more details.

### Mobile (apps/mobile)

React Native mobile application using Expo.

- **Tech Stack**: React Native, Expo, TypeScript
- **Platforms**: iOS, Android, Web

See [apps/mobile/README.md](apps/mobile/README.md) for more details.

## Scripts

- `bun run dev` - Run all apps in development mode
- `bun run build` - Build all apps
- `bun run server:dev` - Run server only
- `bun run mobile:dev` - Run mobile app only
- `bun run clean` - Clean all build artifacts

## Workspace Management

This project uses Bun workspaces. Each app in `apps/*` and package in `packages/*` is a separate workspace with its own `package.json`.

## License

MIT
