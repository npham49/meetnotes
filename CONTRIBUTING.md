# Contributing to MeetNotes

Thank you for your interest in contributing to MeetNotes!

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) v1.2.23 or later
- Node.js (for Expo/React Native)
- For mobile development:
  - Android Studio (for Android)
  - Xcode (for iOS, macOS only)
  - Or use Expo Go app on your phone

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/npham49/meetnotes.git
   cd meetnotes
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start developing:
   ```bash
   # Run server
   bun run server:dev

   # Run mobile app (in another terminal)
   bun run mobile:dev
   ```

## Project Structure

```
meetnotes/
├── apps/
│   ├── server/          # Hono API server
│   │   ├── src/         # Server source code
│   │   └── package.json
│   └── mobile/          # React Native mobile app
│       ├── App.tsx      # Main app component
│       └── package.json
├── packages/            # Shared packages (future use)
└── package.json         # Root workspace configuration
```

## Workspace Commands

This project uses Bun workspaces. You can run commands from the root or within each app:

### From Root Directory

```bash
bun run server:dev    # Run server in dev mode
bun run mobile:dev    # Run mobile app in dev mode
bun run build         # Build all apps
bun run clean         # Clean all build artifacts
```

### From App Directory

```bash
cd apps/server
bun run dev           # Run server
bun run build         # Build server
bun run start         # Run production build

cd apps/mobile
bun run dev           # Run Expo dev server
bun run android       # Run on Android
bun run ios           # Run on iOS
bun run web           # Run on web
```

## Making Changes

1. Create a new branch for your feature/fix
2. Make your changes
3. Test your changes:
   - For server: Run `bun run dev` and test endpoints
   - For mobile: Run `bun run dev` and test on device/emulator
4. Commit your changes with a clear message
5. Push and create a pull request

## Code Style

- TypeScript is used throughout the project
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic

## API Development (Server)

The server uses Hono framework. To add new endpoints:

1. Open `apps/server/src/index.ts`
2. Add your route using Hono's routing syntax:
   ```typescript
   app.get('/api/your-endpoint', (c) => {
     return c.json({ data: 'your data' });
   });
   ```

## Mobile Development

The mobile app uses React Native with Expo. To add new screens:

1. Create components in `apps/mobile/`
2. Update `App.tsx` to include your component
3. Test on multiple platforms if possible

## Adding Shared Packages

For code shared between server and mobile:

1. Create a new package in `packages/`
2. Add it to the workspace
3. Import from either app

## Questions?

Feel free to open an issue if you have questions or need help!
