import { test, expect } from './steps/fixtures.js';

test.describe('Feature: 60-Second Onboarding @onboarding @US-04', () => {
  // ── POSITIVE TESTS ──

  test('@smoke Complete onboarding flow in under 60 seconds', async ({ onboardingPage, page }) => {
    const startTime = Date.now();

    await onboardingPage.goto();

    // Step 1: Input
    await expect(onboardingPage.taskInput).toBeFocused();
    await expect(page.locator('[data-testid="splash-screen"]')).toBeHidden();

    await onboardingPage.typeTask('Finish portfolio website by next Monday');
    await onboardingPage.createWithAI();

    // Step 2: AI enrichment
    await expect(onboardingPage.enrichedTaskCard).toBeVisible();
    await expect(onboardingPage.reasoningCard).toBeVisible();
    await onboardingPage.saveTask();

    // Step 3: Plan preview
    await expect(onboardingPage.planPreview).toBeVisible();
    await onboardingPage.continueToPlanPreview();

    // Step 4: Account prompt
    await expect(onboardingPage.googleAuthButton).toBeVisible();
    await expect(onboardingPage.skipButton).toBeVisible();
    await onboardingPage.skipAuth();

    // Should be on dashboard
    await expect(page).toHaveURL(/dashboard/);

    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(60_000);
  });

  test('Reasoning Card shown during onboarding builds trust', async ({ onboardingPage }) => {
    await onboardingPage.goto();
    await onboardingPage.typeTask('Finish portfolio website by next Monday');
    await onboardingPage.createWithAI();

    await expect(onboardingPage.enrichedTaskCard).toBeVisible();
    await expect(onboardingPage.reasoningCard).toBeVisible();

    // Reasoning card shows detected keywords
    const reasoningText = await onboardingPage.reasoningCard.textContent();
    expect(reasoningText).toMatch(/deadline|category/i);
  });

  test('Guest session persists for 7 days', async ({ onboardingPage, page, context }) => {
    await onboardingPage.goto();
    await onboardingPage.typeTask('Test persistence');
    await onboardingPage.createWithAI();
    await onboardingPage.saveTask();
    await onboardingPage.continueToPlanPreview();
    await onboardingPage.skipAuth();

    // Close and reopen
    const newPage = await context.newPage();
    await newPage.goto('/');

    // Should go to dashboard, not onboarding
    await expect(newPage).toHaveURL(/dashboard/);
  });

  // ── NEGATIVE TESTS ──

  test('Empty input in Step 1 — Create button visibility', async ({ onboardingPage, page }) => {
    await onboardingPage.goto();

    // Empty: button not visible
    await expect(onboardingPage.createWithAIButton).toBeHidden();

    // 3 chars: still hidden
    await onboardingPage.typeTask('abc');
    await expect(onboardingPage.createWithAIButton).toBeHidden();

    // 4 chars: appears
    await onboardingPage.typeTask('abcd');
    await expect(onboardingPage.createWithAIButton).toBeVisible();
  });

  test('AI enrichment fails during onboarding', async ({ onboardingPage, page }) => {
    await page.route('**/api.openai.com/**', (route) =>
      route.fulfill({ status: 500, body: 'Error' }),
    );

    await onboardingPage.goto();
    await onboardingPage.typeTask('Buy groceries for dinner');
    await onboardingPage.createWithAI();

    await expect(page.getByText(/ai.*having trouble/i)).toBeVisible();
    await expect(onboardingPage.saveAnywayButton).toBeVisible();
  });

  test('Google OAuth fails during account creation', async ({ onboardingPage, page }) => {
    await onboardingPage.goto();
    await onboardingPage.typeTask('Test task');
    await onboardingPage.createWithAI();
    await onboardingPage.saveTask();
    await onboardingPage.continueToPlanPreview();

    // Mock Google OAuth failure
    await page.route('**/oauth2.googleapis.com/**', (route) =>
      route.fulfill({ status: 400, body: '{"error":"access_denied"}' }),
    );

    await onboardingPage.googleAuthButton.click();
    await expect(page.getByText(/couldn.*connect.*google/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /skip/i })).toBeVisible();
  });

  // ── BOUNDARY / EDGE CASE TESTS ──

  test('@boundary Page LCP under 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/onboarding');
    await page.waitForLoadState('domcontentloaded');

    // LCP proxy: first interactive element visible
    await expect(page.getByPlaceholder(/what.*mind/i)).toBeVisible();
    const lcp = Date.now() - startTime;
    expect(lcp).toBeLessThan(2000);
  });

  test('@edge-case Browser refresh during Step 2', async ({ onboardingPage, page }) => {
    await onboardingPage.goto();
    await onboardingPage.typeTask('Test task');
    await onboardingPage.createWithAI();
    await expect(onboardingPage.enrichedTaskCard).toBeVisible();

    await page.reload();

    // Should return to Step 1
    await expect(onboardingPage.taskInput).toBeVisible();
    await expect(onboardingPage.taskInput).toHaveValue('');
  });

  test('@edge-case Browser back button during Step 3', async ({ onboardingPage, page }) => {
    await onboardingPage.goto();
    await onboardingPage.typeTask('Test task');
    await onboardingPage.createWithAI();
    await onboardingPage.saveTask();
    await expect(onboardingPage.planPreview).toBeVisible();

    await page.goBack();
    await expect(onboardingPage.enrichedTaskCard).toBeVisible();
  });
});
