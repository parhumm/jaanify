import type { Page, Locator } from '@playwright/test';

export class TaskInputPage {
  readonly page: Page;
  readonly taskInput: Locator;
  readonly saveButton: Locator;
  readonly parsedResultCard: Locator;
  readonly parsingIndicator: Locator;
  readonly charCountWarning: Locator;
  readonly voiceToggle: Locator;
  readonly saveWithoutAIButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskInput = page.getByRole('textbox', { name: /task/i });
    this.saveButton = page.getByRole('button', { name: /save task/i });
    this.parsedResultCard = page.locator('[data-testid="parsed-result-card"]');
    this.parsingIndicator = page.locator('[data-testid="parsing-indicator"]');
    this.charCountWarning = page.locator('[data-testid="char-count-warning"]');
    this.voiceToggle = page.getByRole('button', { name: /voice/i });
    this.saveWithoutAIButton = page.getByRole('button', { name: /save without ai/i });
    this.successMessage = page.getByText('Task saved');
  }

  async goto() {
    await this.page.goto('/tasks/new');
  }

  async typeTask(text: string) {
    await this.taskInput.fill(text);
  }

  async typeTaskSlowly(text: string, delayMs = 200) {
    await this.taskInput.pressSequentially(text, { delay: delayMs });
  }

  async waitForParsing() {
    await this.parsedResultCard.waitFor({ state: 'visible', timeout: 5000 });
  }

  async saveTask() {
    await this.saveButton.click();
  }

  getParsedField(fieldName: string): Locator {
    return this.parsedResultCard.locator(`[data-field="${fieldName}"]`);
  }

  getEditButton(fieldName: string): Locator {
    return this.parsedResultCard.locator(`[data-field="${fieldName}"] button[aria-label="Edit"]`);
  }

  getSubtaskItems(): Locator {
    return this.parsedResultCard.locator('[data-testid="subtask-item"]');
  }
}
