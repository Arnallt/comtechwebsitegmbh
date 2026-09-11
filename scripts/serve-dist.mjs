// Minimal static server for testing the production build. Not `astro
// preview`: it special-cases "agent" shells by silently backgrounding
// itself on some platforms and running truly foreground on others, which
// makes it unsafe to drive from Playwright's webServer or any script that
// needs to know when the process is actually up (see git history — it hung
// CI for exactly this reason). Plain Node http server has no such surprise.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = 'dist';
const BASE = '/comtechwebsitegmbh';
const PORT = process.env.PORT ?? 4321;

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.json': 'application/json',
};

createServer(async (req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname.startsWith(BASE)) pathname = pathname.slice(BASE.length) || '/';
  if (pathname.endsWith('/')) pathname += 'index.html';

  const filePath = join(ROOT, pathname);
  try {
    const s = await stat(filePath);
    if (s.isDirectory()) throw new Error('is a directory');
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`serving ${ROOT} at http://localhost:${PORT}${BASE}/`);
});
