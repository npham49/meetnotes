import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Routes
app.get('/', (c) => {
  return c.json({
    message: 'Welcome to MeetNotes API',
    version: '0.1.0',
  });
});

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Sample API routes
app.get('/api/notes', (c) => {
  return c.json({
    notes: [
      { id: 1, title: 'Sample Note 1', content: 'This is a sample note' },
      { id: 2, title: 'Sample Note 2', content: 'This is another sample note' },
    ],
  });
});

app.post('/api/notes', async (c) => {
  const body = await c.req.json();
  return c.json({
    message: 'Note created',
    note: { id: 3, ...body },
  }, 201);
});

const port = process.env.PORT || 3000;

console.log(`🚀 Server running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
