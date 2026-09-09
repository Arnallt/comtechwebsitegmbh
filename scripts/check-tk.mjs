// Fails the build if any {{TK: ...}} placeholder survives. CLAUDE.md §2.3.
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const TK = /\{\{TK:/;
const roots = ['dist', 'src'].filter(existsSync);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

let hits = [];
for (const root of roots) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (TK.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
    });
  }
}

if (hits.length) {
  console.error(`check:tk found ${hits.length} unresolved placeholder(s):\n`);
  console.error(hits.join('\n'));
  process.exit(1);
}

console.log('check:tk: no unresolved {{TK: placeholders.');
