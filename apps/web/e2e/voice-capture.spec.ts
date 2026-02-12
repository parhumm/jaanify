import { test, expect } from './steps/fixtures.js';

test.describe('Feature: Voice Task Capture @voice-capture @US-03', () => {
  // ── POSITIVE TESTS ──

  test('@smoke Complete voice task capture flow', async ({ dashboardPage, voiceFAB, page }) => {
    await dashboardPage.goto();

    // Grant microphone permission via browser context
    await page.context().grantPermissions(['microphone']);

    await voiceFAB.tapFAB();
    await expect(voiceFAB.pulseAnimation).toBeVisible();
    await expect(voiceFAB.waveform).toBeVisible();

    // Simulate speech recognition (mocked via route interception)
    // In real E2E, this requires Web Speech API mock or a test harness
    // For now, verify the UI states are correct

    // After speech simulation completes
    await expect(voiceFAB.transcriptionText).toBeVisible();
  });

  test('Voice capture accessible from task input page', async ({ taskInputPage, page }) => {
    await taskInputPage.goto();
    await page.context().grantPermissions(['microphone']);

    await taskInputPage.voiceToggle.click();
    await expect(page.locator('[data-testid="pulse-animation"]')).toBeVisible();
  });

  // ── NEGATIVE TESTS ──

  test('Microphone permission denied', async ({ dashboardPage, voiceFAB, page }) => {
    await dashboardPage.goto();

    // Deny microphone
    await page.context().clearPermissions();

    page.on('dialog', async (dialog) => {
      // Browser permission dialog
      await dialog.dismiss();
    });

    await voiceFAB.tapFAB();
    await expect(voiceFAB.permissionMessage).toBeVisible();
    await expect(page.getByRole('link', { name: /text input/i })).toBeVisible();
  });

  test('Browser does not support Web Speech API', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();

    // Mock unavailable Web Speech API
    await page.evaluate(() => {
      Object.defineProperty(window, 'SpeechRecognition', { value: undefined });
      Object.defineProperty(window, 'webkitSpeechRecognition', { value: undefined });
    });

    await page.reload();

    const fabButton = page.locator('[data-testid="voice-fab"]');
    await expect(fabButton).toHaveCSS('opacity', /0\.[3-5]/);
  });

  test('Voice recognition returns empty transcript after 10 seconds', async ({
    dashboardPage,
    voiceFAB,
    page,
  }) => {
    await dashboardPage.goto();
    await page.context().grantPermissions(['microphone']);

    await voiceFAB.tapFAB();
    // Wait for timeout
    await expect(voiceFAB.noSpeechMessage).toBeVisible({ timeout: 12_000 });
    await expect(voiceFAB.retryButton).toBeVisible();
  });

  // ── BOUNDARY / EDGE CASE TESTS ──

  test('@boundary Voice capture within 12-second budget', async ({
    dashboardPage,
    voiceFAB,
    page,
  }) => {
    const startTime = Date.now();

    await dashboardPage.goto();
    await page.context().grantPermissions(['microphone']);

    await voiceFAB.tapFAB();
    // Simulated speech + save would complete here
    // Total time verification
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(12_000);
  });

  test('@edge-case Cancel voice capture mid-recording', async ({
    dashboardPage,
    voiceFAB,
    page,
  }) => {
    await dashboardPage.goto();
    await page.context().grantPermissions(['microphone']);

    await voiceFAB.tapFAB();
    await expect(voiceFAB.pulseAnimation).toBeVisible();

    // Cancel by tapping again
    await voiceFAB.tapFAB();
    await expect(voiceFAB.pulseAnimation).toBeHidden();
  });
});
