import { test as base } from 'playwright-bdd';
import { TaskInputPage } from '../pages/TaskInputPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { OnboardingPage } from '../pages/OnboardingPage.js';
import { ReasoningCardComponent } from '../pages/ReasoningCardComponent.js';
import { VoiceFABComponent } from '../pages/VoiceFABComponent.js';

type Fixtures = {
  taskInputPage: TaskInputPage;
  dashboardPage: DashboardPage;
  onboardingPage: OnboardingPage;
  voiceFAB: VoiceFABComponent;
};

export const test = base.extend<Fixtures>({
  taskInputPage: async ({ page }, use) => {
    await use(new TaskInputPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
  },
  voiceFAB: async ({ page }, use) => {
    await use(new VoiceFABComponent(page));
  },
});

export { expect } from '@playwright/test';
