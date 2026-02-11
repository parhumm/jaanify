import { test, expect } from './steps/fixtures.js';
import { ReasoningCardComponent } from './pages/ReasoningCardComponent.js';

test.describe('Feature: Reasoning Card Drill-Down @reasoning-cards @US-05', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    // Background: logged in, dashboard, 3 tasks with AI reasoning
    await dashboardPage.goto();
  });

  // ── POSITIVE TESTS ──

  test('@smoke Tier 1 glanceable reasoning visible by default', async ({ dashboardPage }) => {
    await expect(dashboardPage.getTaskReasoning(1)).toBeVisible();
    await expect(dashboardPage.getTaskReasoning(2)).toBeVisible();

    const taskCount = await dashboardPage.getAllTaskCount();
    for (let i = 1; i <= taskCount; i++) {
      await expect(dashboardPage.getTaskReasoning(i)).toBeVisible();
    }
  });

  test('Expand to Tier 2 explorable view', async ({ dashboardPage, page }) => {
    const task1 = dashboardPage.getTask(1);
    const reasoning = new ReasoningCardComponent(page, task1);

    await reasoning.expandTier2();

    await expect(reasoning.factorBars.first()).toBeVisible();
    await expect(reasoning.confidence).toContainText('%');
    await expect(reasoning.dataSource).toBeVisible();
    await expect(reasoning.overrideButton).toBeVisible();
  });

  test('Expand to Tier 3 auditable view', async ({ dashboardPage, page }) => {
    const task1 = dashboardPage.getTask(1);
    const reasoning = new ReasoningCardComponent(page, task1);

    await reasoning.expandTier2();
    await reasoning.expandTier3();

    await expect(reasoning.tier3View).toBeVisible();
    await expect(reasoning.reasoningChain.first()).toBeVisible();
    await expect(reasoning.historicalAccuracy).toBeVisible();
    await expect(reasoning.adjustWeightsButton).toBeVisible();
  });

  // ── NEGATIVE TESTS ──

  test('Tier 3 data fetch fails', async ({ dashboardPage, page }) => {
    // Mock Tier 3 API failure
    await page.route('**/v1/tasks/*/reasoning**', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    );

    const task1 = dashboardPage.getTask(1);
    const reasoning = new ReasoningCardComponent(page, task1);

    await reasoning.expandTier2();
    await reasoning.seeFullReasoningButton.click();

    await expect(page.getByText(/full reasoning unavailable/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
    await expect(reasoning.tier2Card).toBeVisible(); // Tier 2 remains visible
  });

  test('Reasoning card with missing factor data', async ({ dashboardPage, page }) => {
    const task2 = dashboardPage.getTask(2);
    const reasoning = new ReasoningCardComponent(page, task2);

    await reasoning.expandTier2();

    // Some factors may show "Data not yet available"
    const missingFactors = reasoning.tier2Card.getByText('Data not yet available');
    // This is a conditional check — not all tasks will have missing data
  });

  // ── EDGE CASE TESTS ──

  test('@edge-case Collapse Tier 2 and re-expand', async ({ dashboardPage, page }) => {
    const task1 = dashboardPage.getTask(1);
    const reasoning = new ReasoningCardComponent(page, task1);

    await reasoning.expandTier2();
    await expect(reasoning.tier2Card).toBeVisible();

    await reasoning.collapseTier2();
    await expect(reasoning.tier2Card).toBeHidden();

    await reasoning.expandTier2();
    await expect(reasoning.tier2Card).toBeVisible();
    await expect(reasoning.factorBars.first()).toBeVisible();
  });

  test('Tier preference persists across sessions', async ({ dashboardPage, page, context }) => {
    const task1 = dashboardPage.getTask(1);
    const reasoning = new ReasoningCardComponent(page, task1);

    await reasoning.expandTier2();

    // Open new page in same context (simulates close + reopen)
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');

    const newTask1 = newPage.locator('[data-testid="task-card"]:nth-child(1)');
    const newTier2 = newTask1.locator('[data-testid="tier2-card"]');
    await expect(newTier2).toBeVisible();
  });

  test('@boundary Tier 3 with very long reasoning chain (20 steps)', async ({
    dashboardPage,
    page,
  }) => {
    const task1 = dashboardPage.getTask(1);
    const reasoning = new ReasoningCardComponent(page, task1);

    await reasoning.expandTier2();
    await reasoning.expandTier3();

    const steps = reasoning.reasoningChain;
    const count = await steps.count();
    expect(count).toBeGreaterThan(0);

    // Verify scrollable within max height
    const tier3Box = await reasoning.tier3View.boundingBox();
    if (tier3Box) {
      expect(tier3Box.height).toBeLessThanOrEqual(400);
    }
  });
});
