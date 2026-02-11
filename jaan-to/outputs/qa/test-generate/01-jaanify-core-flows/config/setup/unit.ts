import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '../mocks/server.js';

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers between tests to prevent state leakage
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
