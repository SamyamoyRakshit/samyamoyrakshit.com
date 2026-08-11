#!/usr/bin/env node
/**
 * WCAG 2.2 contrast audit for the Ledger design system.
 *
 * Reads the OKLCH tokens straight out of `src/styles/global.css` — there is no
 * second copy of the palette to fall out of sync — converts them to sRGB, and
 * asserts every meaningful foreground/background pairing in BOTH themes.
 *
 *   npm run check:contrast
 *
 * Exits non-zero on any failure, so it can gate a build or a commit.
 *
 * Conversion chain: OKLCH → OKLab → LMS → linear sRGB → relative luminance.
 * Matrices are from the OKLab spec (Björn Ottosson).
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CSS_PATH = resolve(HERE, '..', 'src', 'styles', 'global.css');

/* ── colour maths ────────────────────────────────────────────────────────── */

/** oklch(L C H) → { r, g, b } in linear-light sRGB (may be out of gamut) */
function oklchToLinearSrgb(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

const clamp01 = (x) => Math.min(1, Math.max(0, x));

/** WCAG relative luminance. Clamped to gamut first, matching what a screen shows. */
function relativeLuminance({ r, g, b }) {
  const R = clamp01(r);
  const G = clamp01(g);
  const B = clamp01(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(c1, c2) {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Linear sRGB → "#rrggbb", for a readable report */
function toHex(c) {
  const enc = (u) => {
    const v = clamp01(u);
    const s = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.round(clamp01(s) * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${enc(c.r)}${enc(c.g)}${enc(c.b)}`;
}

/** WCAG relative luminance of a "#rrggbb" string. */
function hexLuminance(hex) {
  const c = hex.replace('#', '');
  const channels = [0, 2, 4]
    .map((i) => parseInt(c.substr(i, 2), 16) / 255)
    .map((u) => (u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** True if the OKLCH value falls outside the sRGB gamut and will be clipped. */
function outOfGamut(c) {
  const EPS = 0.0008;
  return [c.r, c.g, c.b].some((v) => v < -EPS || v > 1 + EPS);
}

/* ── token extraction ────────────────────────────────────────────────────── */

const OKLCH = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/;
const TOKEN =
  /--([\w-]+)\s*:\s*light-dark\(\s*(oklch\([^)]*\))\s*,\s*(oklch\([^)]*\))\s*\)/g;

function parseOklch(str) {
  const m = str.match(OKLCH);
  if (!m) throw new Error(`Unparseable colour: ${str}`);
  return oklchToLinearSrgb(Number(m[1]), Number(m[2]), Number(m[3]));
}

/* ── the pairings that must hold ─────────────────────────────────────────── */

/** [foreground, background, minimum ratio, what it is] */
const PAIRINGS = [
  ['ink', 'paper', 4.5, 'body text on page'],
  ['ink', 'paper-raised', 4.5, 'body text on raised card'],
  ['ink', 'paper-sunken', 4.5, 'body text on sunken block (code)'],
  ['ink-muted', 'paper', 4.5, 'secondary text on page'],
  ['ink-muted', 'paper-raised', 4.5, 'secondary text on raised card'],
  ['ink-faint', 'paper', 4.5, 'monospace labels / metadata'],
  ['ink-faint', 'paper-raised', 4.5, 'metadata on raised card'],
  ['accent', 'paper', 4.5, 'accent text / hovered links'],
  ['accent', 'paper-raised', 4.5, 'accent text on raised card'],
  ['accent-hover', 'paper', 4.5, 'accent hover state'],
  ['on-accent', 'accent', 4.5, 'text on filled accent (buttons, skip link)'],
  ['paper', 'ink', 4.5, 'inverted button text on hover'],
  ['ink', 'accent-soft', 4.5, 'text inside a <mark> highlight'],
  ['accent', 'accent-soft', 4.5, 'stack tags — accent text on its own tint'],
  ['tint-sky-fg', 'tint-sky-bg', 4.5, 'chip · sky'],
  ['tint-mint-fg', 'tint-mint-bg', 4.5, 'chip · mint'],
  ['tint-amber-fg', 'tint-amber-bg', 4.5, 'chip · amber'],
  ['tint-violet-fg', 'tint-violet-bg', 4.5, 'chip · violet'],
  ['ink-muted', 'paper-raised', 4.5, 'tag text on a card'],
  ['ink-muted', 'paper-sunken', 4.5, 'prose text on code/quote blocks'],
  /* The sunken ground carries small text in three places — the FULL TIME chip
     on /experience/, the stack tags, and the attribution under the epigraph —
     and small text is exactly where a recessed background bites first. */
  ['ink-faint', 'paper-sunken', 4.5, 'chips and credits on a sunken ground'],

  /* The hero glow is not a flat surface, but the name, the role, the statement
     and the buttons all sit over its brightest part — so it is a background
     like any other and is held to the same bar. Checked against the raw token,
     which is the worst case: on the page it is painted at 0.9 opacity over
     --paper, which lightens it. */
  ['ink', 'hero-wash', 4.5, 'hero name / statement over the glow'],
  ['ink-muted', 'hero-wash', 4.5, 'hero role and statement over the glow'],
  ['ink-faint', 'hero-wash', 4.5, 'hero metadata over the glow'],
  ['accent', 'hero-wash', 4.5, 'hero links and outlined button over the glow'],
  // Non-text: UI component boundaries and focus rings need 3:1 (WCAG 1.4.11)
  ['rule-strong', 'paper', 3, 'strong hairline (non-text)'],
  ['accent', 'paper', 3, 'focus ring against page'],
  ['ink', 'paper', 3, 'button border (non-text)'],
];

/* ── run ─────────────────────────────────────────────────────────────────── */

const css = await readFile(CSS_PATH, 'utf8');

const light = new Map();
const dark = new Map();
for (const [, name, lightVal, darkVal] of css.matchAll(TOKEN)) {
  light.set(name, parseOklch(lightVal));
  dark.set(name, parseOklch(darkVal));
}

if (light.size === 0) {
  console.error(`✗ No light-dark() OKLCH tokens found in ${CSS_PATH}`);
  process.exit(1);
}

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const OFF = '\x1b[0m';

let failures = 0;
let warnings = 0;

console.log(
  `\n${BOLD}WCAG 2.2 contrast audit${OFF} ${DIM}· ${light.size} tokens · ${PAIRINGS.length} pairings × 2 themes${OFF}\n`
);

// Gamut sanity check first — an out-of-gamut token renders differently than authored.
for (const [themeName, tokens] of [
  ['light', light],
  ['dark', dark],
]) {
  for (const [name, colour] of tokens) {
    if (outOfGamut(colour)) {
      console.log(
        `${YELLOW}⚠${OFF}  --${name} (${themeName}) is outside the sRGB gamut and will be clipped to ${toHex(colour)}`
      );
      warnings++;
    }
  }
}
if (warnings) console.log('');

for (const [themeName, tokens] of [
  ['light', light],
  ['dark', dark],
]) {
  console.log(`${BOLD}${themeName.toUpperCase()}${OFF}`);

  for (const [fg, bg, min, description] of PAIRINGS) {
    const fgColour = tokens.get(fg);
    const bgColour = tokens.get(bg);

    if (!fgColour || !bgColour) {
      console.log(`${RED}✗${OFF}  missing token: ${!fgColour ? fg : bg}`);
      failures++;
      continue;
    }

    const ratio = contrastRatio(fgColour, bgColour);
    const pass = ratio >= min;
    if (!pass) failures++;

    const mark = pass ? `${GREEN}✓${OFF}` : `${RED}✗${OFF}`;
    const shown = ratio.toFixed(2).padStart(5);
    const pair = `${fg} on ${bg}`.padEnd(34);

    console.log(
      `${mark}  ${shown}:1 ${DIM}(min ${min})${OFF}  ${pair} ${DIM}${description}${OFF}`
    );
  }
  console.log('');
}

/* ── syntax highlighting ─────────────────────────────────────────────────
   The CSS tokens above are ours; the code colours are not. Shiki themes are
   drawn for their own background, so putting one on a different surface can
   quietly push muted tokens — comments especially — under 4.5:1. Nothing in
   the stylesheet reveals that, so check the real theme colours directly.
   ──────────────────────────────────────────────────────────────────────── */

const CONFIG_PATH = resolve(HERE, '..', 'astro.config.mjs');
const config = await readFile(CONFIG_PATH, 'utf8');
const themeMatch = config.match(
  /themes:\s*\{\s*light:\s*'([^']+)'\s*,\s*dark:\s*'([^']+)'/
);

if (themeMatch) {
  const [, lightTheme, darkTheme] = themeMatch;
  const codeBg = { light: light.get('code-bg'), dark: dark.get('code-bg') };

  if (!codeBg.light || !codeBg.dark) {
    console.log(`${YELLOW}⚠${OFF}  --code-bg token not found; skipping syntax audit\n`);
  } else {
    let shiki;
    try {
      shiki = await import('shiki');
    } catch {
      shiki = null;
    }

    if (!shiki) {
      console.log(`${YELLOW}⚠${OFF}  shiki not resolvable; skipping syntax audit\n`);
    } else {
      const highlighter = await shiki.createHighlighter({
        themes: [lightTheme, darkTheme],
        langs: ['ts'],
      });

      console.log(`${BOLD}SYNTAX HIGHLIGHTING${OFF}`);

      for (const [themeName, bg, label] of [
        [lightTheme, codeBg.light, 'light'],
        [darkTheme, codeBg.dark, 'dark'],
      ]) {
        const theme = highlighter.getTheme(themeName);

        const colours = new Set();
        for (const setting of theme.settings ?? []) {
          if (setting.settings?.foreground) {
            colours.add(setting.settings.foreground.toLowerCase());
          }
        }
        if (theme.fg) colours.add(theme.fg.toLowerCase());

        const bgLuminance = relativeLuminance(bg);

        // Colours on the far side of the background are inverted tokens — they
        // sit on their own coloured chip (diffs, markup), not on the code
        // surface, so measuring them against it is meaningless.
        const readable = [...colours]
          .filter((c) => /^#[0-9a-f]{6}$/.test(c))
          .filter((c) => {
            const l = hexLuminance(c);
            return bgLuminance > 0.5 ? l < 0.55 : l > 0.12;
          });

        let worst = Infinity;
        let worstColour = '';
        for (const colour of readable) {
          const r =
            (Math.max(hexLuminance(colour), bgLuminance) + 0.05) /
            (Math.min(hexLuminance(colour), bgLuminance) + 0.05);
          if (r < worst) {
            worst = r;
            worstColour = colour;
          }
        }

        const pass = worst >= 4.5;
        if (!pass) failures++;

        console.log(
          `${pass ? `${GREEN}✓${OFF}` : `${RED}✗${OFF}`}  ${worst.toFixed(2).padStart(5)}:1 ${DIM}(min 4.5)${OFF}  ` +
            `${themeName} on --code-bg`.padEnd(46) +
            `${DIM}${label} · worst of ${readable.length} token colours (${worstColour})${OFF}`
        );
      }
      console.log('');
    }
  }
}

/* ── hard-coded literals ─────────────────────────────────────────────────
   Three files cannot reach the stylesheet: a favicon is a standalone
   document, a share card is a bag of pixels, and <meta name="theme-color">
   takes a hex or nothing. Each therefore repeats a token value by hand.

   "Change them by hand when the tokens change" was the rule, and it failed —
   the paper moved from a cool grey to a warm one and all three kept the old
   blue, so the browser chrome, the tab icon and every share card carried a
   ground the site itself had stopped using. A hand-maintained invariant that
   nothing checks is a defect waiting on a schedule. This is the check.
   ──────────────────────────────────────────────────────────────────────── */

const LITERALS_PATH = (...p) => resolve(HERE, '..', ...p);

/** Same channel after rounding, ±1, since these get copied by hand. */
function hexMatches(actual, expected) {
  const ch = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const [a, b] = [ch(actual.toLowerCase()), ch(expected.toLowerCase())];
  return a.every((v, i) => Math.abs(v - b[i]) <= 1);
}

/** [file, regex, groups → [token, theme, what it is]] */
const LITERAL_SOURCES = [
  {
    file: ['src', 'lib', 'mark.ts'],
    pattern:
      /(light|dark):\s*\{\s*paper:\s*'(#[0-9a-fA-F]{6})',\s*ink:\s*'(#[0-9a-fA-F]{6})',\s*accent:\s*'(#[0-9a-fA-F]{6})'/g,
    extract: ([, theme, paper, ink, accent]) => [
      { hex: paper, token: 'paper', theme, what: 'icon paper' },
      { hex: ink, token: 'ink', theme, what: 'icon ink' },
      { hex: accent, token: 'accent', theme, what: 'icon accent' },
    ],
  },
  {
    file: ['src', 'pages', 'og', '[...slug].png.ts'],
    pattern: /const (PAPER|INK|FAINT|RULE|ACCENT) = '(#[0-9a-fA-F]{6})'/g,
    extract: ([, name, hex]) => [
      {
        hex,
        token: {
          PAPER: 'paper',
          INK: 'ink',
          FAINT: 'ink-faint',
          RULE: 'rule',
          ACCENT: 'accent',
        }[name],
        theme: 'light',
        what: `share card ${name.toLowerCase()}`,
      },
    ],
  },
  {
    file: ['src', 'components', 'BaseHead.astro'],
    pattern:
      /name="theme-color"\s+content="(#[0-9a-fA-F]{6})"\s+media="\(prefers-color-scheme:\s*(light|dark)\)"/g,
    extract: ([, hex, theme]) => [{ hex, token: 'paper', theme, what: 'browser chrome' }],
  },
];

console.log(
  `${BOLD}HARD-CODED LITERALS${OFF} ${DIM}· files that cannot read the stylesheet${OFF}`
);

let literalsChecked = 0;
for (const source of LITERAL_SOURCES) {
  const path = LITERALS_PATH(...source.file);
  const text = await readFile(path, 'utf8');
  const found = [...text.matchAll(source.pattern)].flatMap(source.extract);

  if (found.length === 0) {
    console.log(
      `${YELLOW}⚠${OFF}  no literals matched in ${source.file.join('/')} — has it been restructured?`
    );
    warnings++;
    continue;
  }

  for (const { hex, token, theme, what } of found) {
    literalsChecked++;
    const expected = toHex((theme === 'light' ? light : dark).get(token));
    const ok = hexMatches(hex, expected);
    if (!ok) failures++;
    console.log(
      `${ok ? `${GREEN}✓${OFF}` : `${RED}✗${OFF}`}  ${hex}  ` +
        `${`--${token} (${theme})`.padEnd(24)} ${DIM}${what}${OFF}` +
        (ok ? '' : `  ${RED}→ should be ${expected}${OFF}`)
    );
  }
}
console.log('');

if (failures > 0) {
  console.error(
    `${RED}${BOLD}✗ ${failures} ${failures === 1 ? 'failure' : 'failures'}.${OFF} Adjust the OKLCH lightness of the offending token in src/styles/global.css, or bring the literal back in line with it.\n`
  );
  process.exit(1);
}

console.log(
  `${GREEN}${BOLD}✓ All pairings meet WCAG 2.2 AA${OFF}` +
    `${DIM}, and ${literalsChecked} hard-coded literals match their tokens${OFF}` +
    `${warnings ? ` ${YELLOW}(${warnings} warning${warnings === 1 ? '' : 's'})${OFF}` : ''}\n`
);
