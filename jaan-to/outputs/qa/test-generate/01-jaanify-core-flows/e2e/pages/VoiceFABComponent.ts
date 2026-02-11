import type { Page, Locator } from '@playwright/test';

export class VoiceFABComponent {
  readonly page: Page;
  readonly fabButton: Locator;
  readonly pulseAnimation: Locator;
  readonly waveform: Locator;
  readonly transcriptionText: Locator;
  readonly listeningPaused: Locator;
  readonly enrichedCard: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly retryButton: Locator;
  readonly noSpeechMessage: Locator;
  readonly permissionMessage: Locator;
  readonly unsupportedMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fabButton = page.locator('[data-testid="voice-fab"]');
    this.pulseAnimation = page.locator('[data-testid="pulse-animation"]');
    this.waveform = page.locator('[data-testid="waveform"]');
    this.transcriptionText = page.locator('[data-testid="transcription-text"]');
    this.listeningPaused = page.getByText(/listening paused/i);
    this.enrichedCard = page.locator('[data-testid="enriched-task-card"]');
    this.saveButton = page.getByRole('button', { name: /save task/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.retryButton = page.getByRole('button', { name: /retry/i });
    this.noSpeechMessage = page.getByText(/no speech detected/i);
    this.permissionMessage = page.getByText(/microphone access needed/i);
    this.unsupportedMessage = page.getByText(/voice not supported/i);
  }

  async tapFAB() {
    await this.fabButton.click();
  }

  async isListening(): Promise<boolean> {
    return this.pulseAnimation.isVisible();
  }

  async getTranscription(): Promise<string> {
    return (await this.transcriptionText.textContent()) ?? '';
  }
}
