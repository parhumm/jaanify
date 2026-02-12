import type { Page, Locator } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;
  readonly taskInput: Locator;
  readonly createWithAIButton: Locator;
  readonly enrichedTaskCard: Locator;
  readonly reasoningCard: Locator;
  readonly saveTaskButton: Locator;
  readonly planPreview: Locator;
  readonly continueButton: Locator;
  readonly googleAuthButton: Locator;
  readonly skipButton: Locator;
  readonly saveAnywayButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskInput = page.getByPlaceholder(/what.*mind/i);
    this.createWithAIButton = page.getByRole('button', { name: /create with ai/i });
    this.enrichedTaskCard = page.locator('[data-testid="enriched-task-card"]');
    this.reasoningCard = page.locator('[data-testid="reasoning-card"]');
    this.saveTaskButton = page.getByRole('button', { name: /save task/i });
    this.planPreview = page.locator('[data-testid="plan-preview"]');
    this.continueButton = page.getByRole('button', { name: /continue/i });
    this.googleAuthButton = page.getByRole('button', { name: /continue with google/i });
    this.skipButton = page.getByRole('button', { name: /skip/i });
    this.saveAnywayButton = page.getByRole('button', { name: /save task anyway/i });
    this.errorMessage = page.locator('[role="alert"]');
  }

  async goto() {
    await this.page.goto('/onboarding');
  }

  async typeTask(text: string) {
    await this.taskInput.fill(text);
  }

  async createWithAI() {
    await this.createWithAIButton.click();
  }

  async saveTask() {
    await this.saveTaskButton.click();
  }

  async continueToPlanPreview() {
    await this.continueButton.click();
  }

  async skipAuth() {
    await this.skipButton.click();
  }

  async getCurrentStep(): Promise<number> {
    const stepIndicator = this.page.locator('[data-testid="step-indicator"]');
    const text = await stepIndicator.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
