import type { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly planSummary: Locator;
  readonly taskList: Locator;
  readonly voiceFAB: Locator;
  readonly emptyState: Locator;
  readonly addTaskButton: Locator;
  readonly connectionIndicator: Locator;
  readonly skipToContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.planSummary = page.locator('[data-testid="plan-summary"]');
    this.taskList = page.locator('[data-testid="task-list"]');
    this.voiceFAB = page.getByRole('button', { name: /voice/i });
    this.emptyState = page.locator('[data-testid="empty-state"]');
    this.addTaskButton = page.getByRole('button', { name: /add.*task/i });
    this.connectionIndicator = page.locator('[data-testid="connection-indicator"]');
    this.skipToContent = page.getByText('Skip to main content');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  getTask(index: number): Locator {
    return this.taskList.locator(`[data-testid="task-card"]:nth-child(${index})`);
  }

  getTaskReasoning(index: number): Locator {
    return this.getTask(index).locator('[data-testid="tier1-reasoning"]');
  }

  getTier2Card(index: number): Locator {
    return this.getTask(index).locator('[data-testid="tier2-card"]');
  }

  getOverrideButton(index: number): Locator {
    return this.getTier2Card(index).getByRole('button', { name: /override/i });
  }

  getFactorBars(index: number): Locator {
    return this.getTier2Card(index).locator('[data-testid="factor-bar"]');
  }

  getConfidence(index: number): Locator {
    return this.getTier2Card(index).locator('[data-testid="confidence"]');
  }

  getPriorityRank(index: number): Locator {
    return this.getTask(index).locator('[data-testid="priority-rank"]');
  }

  getPriorityBorder(index: number): Locator {
    return this.getTask(index).locator('[data-testid="priority-border"]');
  }

  getRetryButton(): Locator {
    return this.page.getByRole('button', { name: /retry/i });
  }

  async getAllTaskCount(): Promise<number> {
    return this.taskList.locator('[data-testid="task-card"]').count();
  }
}
