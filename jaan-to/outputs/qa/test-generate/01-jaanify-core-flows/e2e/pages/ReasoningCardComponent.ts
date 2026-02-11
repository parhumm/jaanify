import type { Page, Locator } from '@playwright/test';

export class ReasoningCardComponent {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
  }

  // Tier 1 — glanceable
  get tier1Text(): Locator {
    return this.root.locator('[data-testid="tier1-reasoning"]');
  }

  // Tier 2 — explorable
  get tier2Card(): Locator {
    return this.root.locator('[data-testid="tier2-card"]');
  }

  get factorBars(): Locator {
    return this.tier2Card.locator('[data-testid="factor-bar"]');
  }

  get confidence(): Locator {
    return this.tier2Card.locator('[data-testid="confidence"]');
  }

  get overrideButton(): Locator {
    return this.tier2Card.getByRole('button', { name: /override/i });
  }

  get dataSource(): Locator {
    return this.tier2Card.locator('[data-testid="data-source"]');
  }

  // Tier 3 — auditable
  get seeFullReasoningButton(): Locator {
    return this.tier2Card.getByRole('button', { name: /see full reasoning/i });
  }

  get tier3View(): Locator {
    return this.root.locator('[data-testid="tier3-view"]');
  }

  get reasoningChain(): Locator {
    return this.tier3View.locator('[data-testid="reasoning-step"]');
  }

  get historicalAccuracy(): Locator {
    return this.tier3View.locator('[data-testid="historical-accuracy"]');
  }

  get adjustWeightsButton(): Locator {
    return this.tier3View.getByRole('button', { name: /adjust weights/i });
  }

  async expandTier2() {
    await this.tier1Text.click();
    await this.tier2Card.waitFor({ state: 'visible' });
  }

  async expandTier3() {
    await this.seeFullReasoningButton.click();
    await this.tier3View.waitFor({ state: 'visible' });
  }

  async collapseTier2() {
    await this.tier1Text.click();
    await this.tier2Card.waitFor({ state: 'hidden' });
  }

  async override(reason: string) {
    await this.overrideButton.click();
    const optionButton = this.page.getByRole('button', { name: reason });
    await optionButton.click();
  }
}
