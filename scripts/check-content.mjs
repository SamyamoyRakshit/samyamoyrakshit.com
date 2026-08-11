#!/usr/bin/env node
/**
 * Placeholder audit.
 *
 * Reports every field in src/config/site.ts that is still a TODO, grouped so
 * it reads as a checklist rather than a wall of warnings. Run it any time:
 *
 *   npm run check:content
 *
 * It exits 0 by default — an unfinished site is a normal state, not an error.
 * Pass --strict to make it fail instead, which is what you want in a deploy
 * pipeline once you've actually filled things in.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG = resolve(HERE, '..', 'src', 'config', 'site.ts');

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const OFF = '\x1b[0m';

const strict = process.argv.includes('--strict');
const source = await readFile(CONFIG, 'utf8');
const lines = source.split(/\r?\n/);

/** Nearest `export const <name>` above a line — used to group the report. */
function sectionFor(index) {
  for (let i = index; i >= 0; i--) {
    const match = lines[i].match(/^export const (\w+)/);
    if (match) return match[1];
  }
  return 'file';
}

const groups = new Map();

lines.forEach((line, index) => {
  // Skip the helper definitions at the bottom that legitimately mention TODO.
  if (line.includes("startsWith('TODO')")) return;
  if (!/TODO/.test(line)) return;
  // Skip pure comment lines — those are instructions, not values.
  const withoutIndent = line.trim();
  if (withoutIndent.startsWith('*') || withoutIndent.startsWith('//')) return;

  const section = sectionFor(index);
  if (!groups.has(section)) groups.set(section, []);
  groups.get(section).push({ line: index + 1, text: withoutIndent });
});

const total = [...groups.values()].reduce((n, items) => n + items.length, 0);

if (total === 0) {
  console.log(`\n${GREEN}${BOLD}✓ No placeholders left in src/config/site.ts${OFF}\n`);
  process.exit(0);
}

console.log(
  `\n${BOLD}${total} placeholder${total === 1 ? '' : 's'} still to fill in${OFF} ${DIM}src/config/site.ts${OFF}\n`
);

for (const [section, items] of groups) {
  console.log(`${BOLD}${section}${OFF}`);
  for (const item of items) {
    const text = item.text.length > 92 ? `${item.text.slice(0, 89)}...` : item.text;
    console.log(
      `  ${YELLOW}·${OFF} ${DIM}line ${String(item.line).padStart(3)}${OFF}  ${text}`
    );
  }
  console.log('');
}

console.log(
  `${DIM}Placeholders are hidden automatically in production builds, so it is safe\nto deploy before finishing. They stay visible in ${OFF}npm run dev${DIM} so you can see\nwhere they sit on the page.${OFF}\n`
);

process.exit(strict ? 1 : 0);
