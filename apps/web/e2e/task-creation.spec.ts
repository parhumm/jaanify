import { test, expect } from './steps/fixtures.js';

test.describe('Feature: Natural Language Task Creation @task-creation @US-01', () => {
  test.beforeEach(async ({ taskInputPage }) => {
    // Background: logged in, on task input page, AI available
    await taskInputPage.goto();
  });

  // ── POSITIVE TESTS ──

  test('@smoke Create task with deadline, category, and priority extracted', async ({
    taskInputPage,
  }) => {
    await taskInputPage.typeTask('Call Sarah about the Johnson proposal by Friday 2 PM');
    await taskInputPage.waitForParsing();

    await expect(taskInputPage.parsedResultCard).toBeVisible();
    await expect(taskInputPage.getParsedField('Title')).toContainText(
      'Call Sarah about the Johnson proposal',
    );
    await expect(taskInputPage.getParsedField('Deadline')).toContainText('Friday');
    await expect(taskInputPage.getParsedField('Category')).toContainText('Client work');
  });

  test('Create task with subtasks extracted from natural language', async ({ taskInputPage }) => {
    await taskInputPage.typeTask('Prepare dinner tonight: buy groceries, cook pasta, set the table');
    await taskInputPage.waitForParsing();

    await expect(taskInputPage.parsedResultCard).toBeVisible();
    await expect(taskInputPage.getParsedField('Title')).toContainText('Prepare dinner tonight');
    const subtasks = taskInputPage.getSubtaskItems();
    await expect(subtasks).toHaveCount(3);
  });

  test('AI parsing preview appears in real-time during typing', async ({ taskInputPage }) => {
    await taskInputPage.typeTask('Buy milk');

    await expect(taskInputPage.parsingIndicator).toBeVisible({ timeout: 100 });
    await taskInputPage.waitForParsing();
    await expect(taskInputPage.parsingIndicator).toBeHidden();
  });

  test('Edit parsed field before saving', async ({ taskInputPage }) => {
    await taskInputPage.typeTask('Meeting with Alex tomorrow at 3 PM');
    await taskInputPage.waitForParsing();

    await taskInputPage.getEditButton('Deadline').click();
    const deadlineInput = taskInputPage.page.getByRole('textbox', { name: /deadline/i });
    await deadlineInput.fill('2026-02-10 4:00 PM');
    await taskInputPage.saveTask();

    await expect(taskInputPage.successMessage).toBeVisible();
  });

  // ── NEGATIVE TESTS ──

  test('Submit empty task input', async ({ taskInputPage }) => {
    await taskInputPage.saveTask();

    await expect(taskInputPage.page.getByText('Please enter a task description')).toBeVisible();
  });

  test('AI parsing fails with API error', async ({ taskInputPage, page }) => {
    // Mock AI service to return 503
    await page.route('**/api.openai.com/**', (route) =>
      route.fulfill({ status: 503, body: 'Service Unavailable' }),
    );

    await taskInputPage.typeTask('Buy groceries for dinner tonight');
    await page.waitForTimeout(1000);

    await expect(page.getByText(/couldn.*parse.*right now/i)).toBeVisible();
    await expect(taskInputPage.taskInput).toHaveValue('Buy groceries for dinner tonight');
  });

  test('Submit task with whitespace-only input', async ({ taskInputPage }) => {
    await taskInputPage.typeTask('   ');
    await taskInputPage.saveTask();

    await expect(taskInputPage.page.getByText('Please enter a task description')).toBeVisible();
  });

  test('AI parsing timeout exceeds 3 seconds', async ({ taskInputPage, page }) => {
    await page.route('**/api.openai.com/**', async (route) => {
      await new Promise((r) => setTimeout(r, 5000));
      await route.fulfill({ status: 200, body: '{}' });
    });

    await taskInputPage.typeTask('Finish the quarterly report');
    await expect(page.getByText(/ai.*taking longer/i)).toBeVisible({ timeout: 4000 });
    await expect(taskInputPage.saveWithoutAIButton).toBeVisible();
  });

  // ── BOUNDARY / EDGE CASE TESTS ──

  test('@boundary Task input at maximum 500 characters', async ({ taskInputPage }) => {
    const longText = 'A'.repeat(500);
    await taskInputPage.typeTask(longText);
    await taskInputPage.waitForParsing();

    await expect(taskInputPage.parsedResultCard).toBeVisible();
  });

  test('@boundary Task input exceeds maximum character limit', async ({ taskInputPage }) => {
    const tooLong = 'A'.repeat(501);
    await taskInputPage.typeTask(tooLong);

    await expect(taskInputPage.charCountWarning).toContainText('500/500');
    await expect(taskInputPage.taskInput).toHaveValue('A'.repeat(500));
  });

  test('@edge-case Rapid typing triggers debounce correctly', async ({ taskInputPage, page }) => {
    let parseRequestCount = 0;
    await page.route('**/api.openai.com/**', async (route) => {
      parseRequestCount++;
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          choices: [{ message: { content: '{"title":"Buy milk"}' } }],
        }),
      });
    });

    await taskInputPage.typeTaskSlowly('Buy milk', 200);
    await page.waitForTimeout(1000);

    expect(parseRequestCount).toBe(1);
  });

  test('@edge-case Browser back button during task editing', async ({ taskInputPage, page }) => {
    await taskInputPage.typeTask('Call dentist tomorrow');
    await taskInputPage.waitForParsing();

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Discard unsaved task');
      await dialog.accept();
    });

    await page.goBack();
  });
});
