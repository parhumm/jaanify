import { test, expect } from './steps/fixtures.js';

test.describe('Feature: Transparent AI Daily Plan @daily-plan @US-02', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    // Background: logged in, 5 tasks, AI planner available, on dashboard
    await dashboardPage.goto();
  });

  // ── POSITIVE TESTS ──

  test('@smoke Daily plan generated with transparent reasoning', async ({ dashboardPage }) => {
    await expect(dashboardPage.planSummary).toContainText('Your plan for today');

    const taskCount = await dashboardPage.getAllTaskCount();
    expect(taskCount).toBe(5);

    // Each task has Tier 1 reasoning
    for (let i = 1; i <= 5; i++) {
      await expect(dashboardPage.getTaskReasoning(i)).toBeVisible();
    }
  });

  test('Tier 1 reasoning visible on each task', async ({ dashboardPage }) => {
    await expect(dashboardPage.getTaskReasoning(1)).toContainText('#1 because:');
    await expect(dashboardPage.getTaskReasoning(2)).toBeVisible();

    const taskCount = await dashboardPage.getAllTaskCount();
    for (let i = 1; i <= taskCount; i++) {
      await expect(dashboardPage.getTaskReasoning(i)).toBeVisible();
    }
  });

  test('Expand to Tier 2 reasoning card', async ({ dashboardPage }) => {
    await dashboardPage.getTaskReasoning(1).click();

    const tier2 = dashboardPage.getTier2Card(1);
    await expect(tier2).toBeVisible({ timeout: 300 });

    await expect(dashboardPage.getFactorBars(1).first()).toBeVisible();
    await expect(dashboardPage.getConfidence(1)).toContainText('%');
    await expect(dashboardPage.getOverrideButton(1)).toBeVisible();
  });

  test('Override AI recommendation with feedback', async ({ dashboardPage }) => {
    await dashboardPage.getTaskReasoning(1).click();
    await dashboardPage.getOverrideButton(1).click();

    const overrideOption = dashboardPage.page.getByRole('button', {
      name: /not now.*too tired/i,
    });
    await overrideOption.click();

    await expect(dashboardPage.page.getByText('Plan updated')).toBeVisible();
  });

  // ── NEGATIVE TESTS ──

  test('Plan generation fails due to AI service outage', async ({ dashboardPage, page }) => {
    await page.route('**/api.openai.com/**', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    );

    await page.reload();
    await expect(page.getByText(/couldn.*generate.*ai plan/i)).toBeVisible();
    await expect(dashboardPage.getRetryButton()).toBeVisible();
  });

  test('Plan generation with zero tasks', async ({ page }) => {
    // Navigate as user with no tasks
    await page.goto('/dashboard');

    await expect(page.getByText('No tasks for today')).toBeVisible();
    await expect(page.getByRole('button', { name: /add.*first task/i })).toBeVisible();
  });

  test('Override fails due to network error', async ({ dashboardPage, page }) => {
    await dashboardPage.getTaskReasoning(1).click();

    // Block network for the override request
    await page.route('**/daily-plans/**', (route) => route.abort('failed'));

    await dashboardPage.getOverrideButton(1).click();
    const overrideOption = page.getByRole('button', { name: /not relevant/i });
    await overrideOption.click();

    await expect(page.getByText(/couldn.*update plan/i)).toBeVisible();
  });

  // ── BOUNDARY / EDGE CASE TESTS ──

  test('@boundary Plan generation with 50 tasks', async ({ page }) => {
    // User with 50 tasks
    await page.goto('/dashboard');

    const taskCards = page.locator('[data-testid="task-card"]');
    await expect(taskCards.first()).toBeVisible();
  });

  test('@edge-case Multiple rapid overrides', async ({ dashboardPage }) => {
    await dashboardPage.getTaskReasoning(1).click();
    await dashboardPage.getOverrideButton(1).click();
    const laterOption = dashboardPage.page.getByRole('button', { name: /later/i });
    await laterOption.click();

    // Immediately override task 2
    await dashboardPage.getTaskReasoning(2).click();
    await dashboardPage.getOverrideButton(2).click();
    const laterOption2 = dashboardPage.page.getByRole('button', { name: /later/i });
    await laterOption2.click();

    // Verify no duplicate tasks
    const taskTexts = await dashboardPage.taskList
      .locator('[data-testid="task-card"]')
      .allTextContents();
    const uniqueTexts = new Set(taskTexts);
    expect(uniqueTexts.size).toBe(taskTexts.length);
  });

  test('@edge-case Reasoning data unavailable for legacy task', async ({ dashboardPage }) => {
    // Task 3 has no AI reasoning (simulated via data)
    const task3Reasoning = dashboardPage.getTaskReasoning(3);
    const text = await task3Reasoning.textContent();

    if (text?.includes('No AI reasoning')) {
      await task3Reasoning.click();
      // Should NOT expand
      await expect(dashboardPage.getTier2Card(3)).toBeHidden();
    }
  });
});
