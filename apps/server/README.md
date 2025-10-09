# Server

Hono server for MeetNotes API.

## Development

```bash
# From root directory
bun run server:dev

# Or from apps/server directory
bun run dev
```

## Build

```bash
bun run build
```

## Start (production)

```bash
bun run start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note

This project was created using `bun init` in bun v1.2.23. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

