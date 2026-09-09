// Astro 7 force-backgrounds `preview` in agent shells, which breaks Playwright's
// webServer lifecycle. Start/poll/stop it manually instead.
import { execSync, spawnSync } from 'node:child_process';

const URL = 'http://localhost:4321/comtechwebsitegmbh/';

execSync('npx astro preview', { stdio: 'inherit' });

const deadline = Date.now() + 15_000;
while (Date.now() < deadline) {
  try {
    const res = await fetch(URL);
    if (res.ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 300));
}

const result = spawnSync('npx playwright test', { stdio: 'inherit', shell: true });

execSync('npx astro preview stop', { stdio: 'inherit' });

process.exit(result.status ?? 1);
