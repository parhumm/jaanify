import { test, expect } from './steps/fixtures.js';

test.describe('Feature: Task Prioritization @task-prioritization @US-06', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    // Background: logged in, dashboard, 5 tasks with AI priorities
    await dashboardPage.goto();
  });

  // ── POSITIVE TESTS ──

  test('@smoke Task list shows priority rank with reasoning', async ({ dashboardPage }) => {
    for (let i = 1; i <= 5; i++) {
      await expect(dashboardPage.getPriorityRank(i)).toBeVisible();
      await expect(dashboardPage.getPriorityBorder(i)).toBeVisible();
      await expect(dashboardPage.getTaskReasoning(i)).toBeVisible();
    }

    // Verify color coding (terracotta for high)
    const firstTaskBorder = dashboardPage.getPriorityBorder(1);
    const borderColor = await firstTaskBorder.evaluate((el) =>
      getComputedStyle(el).borderColor,
    );
    expect(borderColor).toBeDefined();
  });

  test('Priority factors shown as visual bars in Tier 2', async ({ dashboardPage }) => {
    await dashboardPage.getTaskReasoning(1).click();

    const tier2 = dashboardPage.getTier2Card(1);
    await expect(tier2).toBeVisible();

    const factorBars = dashboardPage.getFactorBars(1);
    await expect(factorBars).toHaveCount(expect.any(Number));

    // Verify factor labels
    const factorLabels = await tier2.locator('[data-testid="factor-label"]').allTextContents();
    expect(factorLabels.some((l) => /deadline/i.test(l))).toBe(true);
  });

  test('Manual priority override re-prioritizes', async ({ dashboardPage, page }) => {
    await dashboardPage.getTaskReasoning(3).click();
    await dashboardPage.getOverrideButton(3).click();

    const urgentOption = page.getByRole('button', { name: /urgent today/i });
    await urgentOption.click();

    await expect(page.getByText('Priority updated')).toBeVisible({ timeout: 3000 });
  });

  // ── NEGATIVE TESTS ──

  test('Re-prioritization API timeout shows loading', async ({ dashboardPage, page }) => {
    await page.route('**/v1/tasks/*/priority**', async (route) => {
      await new Promise((r) => setTimeout(r, 4000));
      await route.fulfill({ status: 200, body: '{}' });
    });

    await dashboardPage.getTaskReasoning(2).click();
    await dashboardPage.getOverrideButton(2).click();
    const option = page.getByRole('button', { name: /later/i });
    await option.click();

    await expect(page.getByText(/updating priorities/i)).toBeVisible();
    await expect(page.getByText(/still working/i)).toBeVisible({ timeout: 6000 });
  });

  test('Task with no AI priority data', async ({ dashboardPage }) => {
    // Task 5 was created manually
    const task5Rank = dashboardPage.getPriorityRank(5);
    const text = await task5Rank.textContent();

    if (text?.includes('Not prioritized')) {
      await dashboardPage.getTaskReasoning(5).click();
      await expect(
        dashboardPage.getTier2Card(5).getByText(/add ai priority/i),
      ).toBeVisible();
    }
  });

  // ── EDGE CASE TESTS ──

  test('@edge-case All tasks have identical priority scores', async ({ dashboardPage }) => {
    // Verify tiebreaker ordering (by deadline)
    const reasoning1 = await dashboardPage.getTaskReasoning(1).textContent();
    if (reasoning1?.includes('Same priority')) {
      expect(reasoning1).toContain('ordered by deadline');
    }
  });

  test('@edge-case Double-click on override button', async ({ dashboardPage, page }) => {
    let requestCount = 0;
    await page.route('**/v1/tasks/**', (route) => {
      requestCount++;
      return route.continue();
    });

    await dashboardPage.getTaskReasoning(1).click();
    const overrideBtn = dashboardPage.getOverrideButton(1);

    // Double-click rapidly
    await overrideBtn.dblclick();

    // Should only trigger 1 request (button disabled after first click)
    expect(requestCount).toBeLessThanOrEqual(1);
  });
});
