// §9 copy rules over the whole content file, frontmatter included — Vale
// only sees Markdown bodies, and capability-page copy lives in frontmatter.
// Token lists mirror styles/ComTech/*.yml; keep them in sync.
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RULES = [
  { name: 'hedge (§9.1)', patterns: [/\bcould\b/i, /\bpotentially\b/i, /where appropriate/i, /where legally permissible/i, /subject to applicable requirements/i, /within the activities permitted to/i] },
  { name: 'lexicon (§9.5)', patterns: [/\btokeniz(e|ed|ation|es)\b/i, /\bcustomers?\b/i, /\busers?\b/i, /Gold (?:&|and) Precious Metals/i] },
  { name: 'guardrail (§2.2)', patterns: [/FINMA[- ](?:licen[cs]ed|approved)/i, /buy tokeni[sz]ed securities through comtech/i, /invest through comtech/i, /trade tokeni[sz]ed assets/i, /comtech custody/i, /comtech investment platform/i, /comtech (?:1\.0|2\.0|3\.0)/i, /institutional-grade/i, /\bComTech (?:tokenis|holds|custod|redeems|issues|sells)/],
  },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(md|mdx|yaml|yml)$/.test(path)) out.push(path);
  }
  return out;
}

const hits = [];
for (const file of existsSync('src/content') ? walk('src/content') : []) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/\{\{TK:/.test(line)) return; // TK markers are check:tk's job
      for (const rule of RULES) {
        for (const re of rule.patterns) {
          if (re.test(line)) hits.push(`${file}:${i + 1}: ${rule.name}: ${line.trim()}`);
        }
      }
    });
}

if (hits.length) {
  console.error(`check:prose found ${hits.length} §9 violation(s):\n`);
  console.error(hits.join('\n'));
  process.exit(1);
}
console.log('check:prose: no §9 violations.');
