import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: 'http://localhost:4321/comtechwebsitegmbh/',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4321/comtechwebsitegmbh/',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
