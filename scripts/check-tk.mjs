// Fails the build if any {{TK: ...}} placeholder survives. CLAUDE.md §2.3.
// src/ is reported line by line; dist/ (if present) is only counted, since
// its minified HTML lines are unreadable and every dist TK originates in src.
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const TK = /\{\{TK:/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

const srcHits = [];
for (const file of existsSync('src') ? walk('src') : []) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (TK.test(line)) srcHits.push(`${file}:${i + 1}: ${line.trim()}`);
    });
}

let distCount = 0;
for (const file of existsSync('dist') ? walk('dist') : []) {
  const matches = readFileSync(file, 'utf8').match(/\{\{TK:/g);
  if (matches) distCount += matches.length;
}

if (srcHits.length || distCount) {
  console.error(`check:tk: ${srcHits.length} placeholder(s) in src/${distCount ? `, ${distCount} in dist/` : ''}:\n`);
  console.error(srcHits.join('\n'));
  process.exit(1);
}

console.log('check:tk: no unresolved {{TK: placeholders.');
