import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  './',
  './platform/',
  './precious-metals/',
  './technology/',
  './technology/apis/',
  './technology/smart-contracts/',
  './technology/white-label/',
  './solutions/',
  './solutions/banks/',
  './solutions/asset-managers/',
  './solutions/corporates/',
  './solutions/fintech/',
  './developers/',
  './company/about/',
  './company/regulatory-approach/',
  './company/contact/',
  './diagrams/',
];

for (const route of routes) {
  test(`no automatically detectable accessibility violations: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
