import { http, HttpResponse } from 'msw';

/**
 * Default MSW handlers generated from Jaanify OpenAPI 3.1 contract.
 * Override per-test with `server.use()` for specific scenarios.
 */

// ── Google OAuth Token Endpoint ──
const googleOAuthHandler = http.post(
  'https://oauth2.googleapis.com/token',
  () => {
    return HttpResponse.json({
      access_token: 'mock-google-access-token',
      id_token: createMockGoogleIdToken(),
      token_type: 'Bearer',
      expires_in: 3600,
    });
  },
);

// ── OpenAI Chat Completions (Task Parsing + Plan Generation) ──
const openAICompletionsHandler = http.post(
  'https://api.openai.com/v1/chat/completions',
  async ({ request }) => {
    const body = (await request.json()) as { messages: Array<{ content: string }> };
    const userMessage = body.messages.find((m: { content: string }) => m.content)?.content ?? '';

    // Detect if this is a task parse or plan generation request
    if (userMessage.includes('ordered_tasks') || userMessage.includes('[{')) {
      // Plan generation response
      return HttpResponse.json({
        choices: [
          {
            message: {
              content: JSON.stringify({
                ordered_tasks: [
                  { task_id: 'task-1', reasoning: 'Deadline in 2 hours' },
                  { task_id: 'task-2', reasoning: 'High energy match' },
                ],
              }),
            },
          },
        ],
      });
    }

    // Task parse response
    return HttpResponse.json({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: 'Parsed task title',
              deadline: '2026-02-15T14:00:00Z',
              category: 'Client work',
              energy_level: 'high',
              estimated_minutes: 30,
              reasoning: { keywords: ['deadline', 'client'], method: 'nlp' },
            }),
          },
        },
      ],
    });
  },
);

// ── OpenAI Error Handler (for negative tests) ──
const openAIErrorHandler = http.post(
  'https://api.openai.com/v1/chat/completions',
  () => {
    return HttpResponse.json(
      { error: { message: 'Service unavailable', type: 'server_error' } },
      { status: 503 },
    );
  },
);

/**
 * Helper: Create a mock Google ID token (unsigned JWT for testing).
 * In tests, the auth service uses `decodeJwt()` which doesn't verify signatures.
 */
function createMockGoogleIdToken(): string {
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      iss: 'accounts.google.com',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
      sub: 'google-user-123',
    }),
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

// Export default handlers (happy path)
export const handlers = [googleOAuthHandler, openAICompletionsHandler];

// Export named error handlers for per-test overrides
export const errorHandlers = {
  openAI503: openAIErrorHandler,
  googleOAuth: http.post('https://oauth2.googleapis.com/token', () =>
    HttpResponse.json({ error: 'invalid_grant' }, { status: 400 }),
  ),
};
