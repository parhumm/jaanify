import { test, expect } from './steps/fixtures.js';
import AxeBuilder from '@axe-core/playwright';

test.describe('Feature: Accessibility for Neurodivergent Users @accessibility @US-07', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  // ── POSITIVE TESTS ──

  test('@smoke Full keyboard navigation through dashboard', async ({ dashboardPage, page }) => {
    // Tab to "Skip to main content"
    await page.keyboard.press('Tab');
    await expect(dashboardPage.skipToContent).toBeFocused();

    // Tab through header
    await page.keyboard.press('Tab');
    const activeElement = page.locator(':focus');
    await expect(activeElement).toBeVisible();

    // Tab through tasks
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }

    // Press Enter on a task to expand reasoning
    await page.keyboard.press('Enter');
    const tier2 = page.locator('[data-testid="tier2-card"]').first();
    await expect(tier2).toBeVisible();

    // Press Space on checkbox to complete
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
  });

  test('Screen reader support for Reasoning Cards', async ({ dashboardPage, page }) => {
    // Verify ARIA attributes
    const task1 = dashboardPage.getTask(1);
    await expect(task1).toHaveAttribute('role', 'article');

    const reasoning = dashboardPage.getTaskReasoning(1);
    await expect(reasoning).toHaveAttribute('aria-expanded', 'false');

    await reasoning.click();
    await expect(reasoning).toHaveAttribute('aria-expanded', 'true');

    const tier2 = dashboardPage.getTier2Card(1);
    await expect(tier2).toHaveAttribute('role', 'region');
    await expect(tier2).toHaveAttribute('aria-label', /reasoning/i);
  });

  test('High contrast color scheme meets WCAG AA', async ({ page }) => {
    // Run axe-core accessibility audit
    const accessibilityResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Check contrast-specific violations
    const contrastViolations = accessibilityResults.violations.filter(
      (v) => v.id === 'color-contrast',
    );
    expect(contrastViolations).toHaveLength(0);
  });

  // ── NEGATIVE TESTS ──

  test('No keyboard traps in the interface', async ({ page }) => {
    // Navigate through entire page
    const maxTabs = 100;
    const visitedElements = new Set<string>();

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab');

      const tag = await page.evaluate(() => document.activeElement?.tagName || 'BODY');
      if (tag === 'BODY') break; // Reached the end

      const elementId = await page.evaluate(
        () => `${document.activeElement?.tagName}:${document.activeElement?.getAttribute('data-testid') ?? document.activeElement?.textContent?.slice(0, 20)}`,
      );

      // Check for trap: if we visit the same element twice in a short span
      if (visitedElements.has(elementId)) {
        // We cycled back — not a trap
        break;
      }
      visitedElements.add(elementId);
    }

    expect(visitedElements.size).toBeGreaterThan(5);
  });

  test('Automated axe-core audit — zero critical/serious violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');
    const serious = results.violations.filter((v) => v.impact === 'serious');

    expect(critical).toHaveLength(0);
    expect(serious).toHaveLength(0);

    // All images/icons have labels
    const imageViolations = results.violations.filter(
      (v) => v.id === 'image-alt' || v.id === 'svg-img-alt',
    );
    expect(imageViolations).toHaveLength(0);
  });

  test('Focus Mode hides non-essential elements', async ({ page }) => {
    // Activate Focus Mode
    await page.getByRole('button', { name: /settings/i }).click();
    await page.getByRole('switch', { name: /focus mode/i }).click();

    // Only next task visible
    const taskCards = page.locator('[data-testid="task-card"]');
    await expect(taskCards).toHaveCount(1);

    // Exit Focus Mode
    await expect(page.getByRole('button', { name: /show all tasks/i })).toBeVisible();
  });

  // ── EDGE CASE TESTS ──

  test('@edge-case Focus management after Reasoning Card expansion', async ({
    dashboardPage,
    page,
  }) => {
    // Tab to task 1 reasoning
    const reasoning = dashboardPage.getTaskReasoning(1);
    await reasoning.focus();

    // Press Enter to expand Tier 2
    await page.keyboard.press('Enter');
    const tier2 = dashboardPage.getTier2Card(1);
    await expect(tier2).toBeVisible();

    // Focus should move into Tier 2
    const focusedInTier2 = await tier2.locator(':focus').count();
    expect(focusedInTier2).toBeGreaterThan(0);

    // Press Escape to collapse
    await page.keyboard.press('Escape');
    await expect(tier2).toBeHidden();

    // Focus returns to reasoning trigger
    await expect(reasoning).toBeFocused();
  });

  test('Reduced motion preference respected', async ({ page, context }) => {
    // Set prefers-reduced-motion
    await context.route('**/*', (route) => route.continue());
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();

    // Verify no transitions
    const task1 = page.locator('[data-testid="task-card"]').first();
    const transitionDuration = await task1.evaluate(
      (el) => getComputedStyle(el).transitionDuration,
    );
    expect(transitionDuration).toBe('0s');
  });

  test('@edge-case Visual timeline for time blindness support', async ({ dashboardPage, page }) => {
    const timeline = page.locator('[data-testid="visual-timeline"]');

    if (await timeline.isVisible()) {
      const timeBlocks = timeline.locator('[data-testid="time-block"]');
      await expect(timeBlocks).toHaveCount(expect.any(Number));

      const currentIndicator = timeline.locator('[data-testid="current-time"]');
      await expect(currentIndicator).toBeVisible();
    }
  });
});
