/**
 * The mark — the site's logo.
 *
 * It is the share card, miniaturised: an accent rule across the head of the
 * page, the initials set underneath in the display face. Nothing that isn't
 * already in the design system, which is the point — the tab, the home screen
 * icon and the Open Graph card should all look like the same publication.
 *
 * The letterforms are real Inter SemiBold outlines, extracted
 * from `og-fonts/Inter-SemiBold.ttf` — the same file the share
 * cards are set in — so the mark is the site's own typeface rather than an
 * approximation of it. Since they are outlines, they render identically with
 * no font to load and no fallback to flash.
 *
 * They are also, being outlines, fixed: changing `identity.initials` in
 * src/config/site.ts renames the mark without redrawing it. If the initials
 * ever change, re-extract `MARK_PATH` by laying the new letters out with
 * satori against the same TTF — that is how these were made — and update the
 * cap box below to the new bounds.
 *
 * Every rendering of the mark starts here: `/favicon.svg`,
 * `/apple-touch-icon.png` and the share cards. There is no second copy of the
 * geometry to drift.
 *
 * Note where it does *not* appear: the page itself. The header sets the name
 * in full, and a monogram of the same initials beside it would state one thing
 * twice. The mark is for the places type cannot go — a 16px tab, a home screen
 * tile, someone else's timeline.
 */

import { identity } from '../config/site';

/**
 * "SR" in Inter SemiBold, as it comes out of the font at font-size 100.
 * Do not re-space or re-scale these numbers by hand — use `placeMark()`.
 */
export const MARK_PATH =
  'M32.9 98.1L32.9 98.1Q24.4 98.1 18.2 95.5Q12.0 92.8 8.4 87.8Q4.9 82.8 4.6 75.6L4.6 75.6L17.5 75.6Q17.8 79.4 19.9 82.0Q21.9 84.5 25.3 85.7Q28.7 87.0 32.8 87.0L32.8 87.0Q37.1 87.0 40.4 85.7Q43.7 84.4 45.5 82.0Q47.4 79.6 47.4 76.5L47.4 76.5Q47.4 73.7 45.7 71.8Q44.1 69.9 41.1 68.7Q38.2 67.4 34.2 66.4L34.2 66.4L26.0 64.2Q16.8 61.9 11.7 57.2Q6.6 52.4 6.6 44.7L6.6 44.7Q6.6 38.3 10.1 33.4Q13.6 28.6 19.6 25.9Q25.6 23.3 33.2 23.3L33.2 23.3Q41.0 23.3 46.8 26.0Q52.7 28.6 56.0 33.4Q59.3 38.1 59.4 44.2L59.4 44.2L46.8 44.2Q46.3 39.5 42.6 36.9Q38.9 34.4 33.0 34.4L33.0 34.4Q28.9 34.4 26.0 35.6Q23.0 36.8 21.4 39.0Q19.8 41.1 19.8 43.9L19.8 43.9Q19.8 47.0 21.7 48.9Q23.6 50.9 26.4 52.0Q29.3 53.2 32.2 53.9L32.2 53.9L39.0 55.7Q43.1 56.7 46.9 58.3Q50.7 59.9 53.7 62.4Q56.8 64.8 58.6 68.3Q60.4 71.9 60.4 76.6L60.4 76.6Q60.4 83.0 57.1 87.8Q53.9 92.7 47.7 95.4Q41.6 98.1 32.9 98.1ZM85.4 97L72.4 97L72.4 24.2L99.6 24.2Q107.9 24.2 113.6 27.2Q119.3 30.1 122.3 35.4Q125.2 40.6 125.2 47.5L125.2 47.5Q125.2 54.5 122.2 59.6Q119.3 64.7 113.5 67.5Q107.8 70.3 99.4 70.3L99.4 70.3L79.9 70.3L79.9 59.5L97.7 59.5Q102.6 59.5 105.7 58.1Q108.8 56.7 110.4 54.0Q111.9 51.3 111.9 47.5L111.9 47.5Q111.9 43.6 110.4 40.9Q108.8 38.1 105.7 36.6Q102.5 35.2 97.6 35.2L97.6 35.2L85.4 35.2L85.4 97ZM127.9 97L113.3 97L95.6 64.0L109.9 64.0L127.9 97Z';

/**
 * The cap box of that path: where the letters actually start and stop, with
 * the overshoots on the S (which rounds past the cap line at both ends)
 * ignored. Aligning to the cap box rather than the glyph bounds is what stops
 * the mark from sitting visibly low.
 */
const CAP = { x: 4.6, y: 24.2, width: 123.3, height: 72.8 } as const;

/** Every rendering of the mark is drawn in this square. */
export const MARK_VIEWBOX = 32;

/**
 * A transform that lands the cap box at (x, y) with the given width, in the
 * 32-unit field. Height follows from the letterforms — the mark is never
 * distorted.
 */
export function placeMark(x: number, y: number, width: number): string {
  const scale = width / CAP.width;
  const tx = x - CAP.x * scale;
  const ty = y - CAP.y * scale;
  return `translate(${round(tx)} ${round(ty)}) scale(${scale.toFixed(5)})`;
}

const round = (n: number) => Number(n.toFixed(3));

/* ── the icon lockup ──────────────────────────────────────────────────────
   Proportions are fixed here and shared by every raster size, so the 16px
   favicon and the 180px home-screen icon are the same drawing.
   ──────────────────────────────────────────────────────────────────────── */

/** Height of the accent rule across the head of the icon. */
const BAND = 5;
/** Width of the monogram, leaving an even margin either side. */
const MONOGRAM = 26.6;

const MONOGRAM_X = (MARK_VIEWBOX - MONOGRAM) / 2;
const MONOGRAM_HEIGHT = (MONOGRAM / CAP.width) * CAP.height;
/** Optically centred in the paper below the rule, not in the whole square. */
const MONOGRAM_Y = BAND + (MARK_VIEWBOX - BAND - MONOGRAM_HEIGHT) / 2;

export const ICON_TRANSFORM = placeMark(MONOGRAM_X, MONOGRAM_Y, MONOGRAM);

/* ── the stamp ────────────────────────────────────────────────────────────
   The same monogram, framed rather than banded — the form the mark takes when
   it sits *on* a page rather than being one, which on this site means the
   share cards.

   Landscape rather than square: "SR" is close to twice as wide as it is tall,
   so a square frame leaves a band of air above and below it and the mark reads
   as two letters that happen to be in a box. Fitted to the letters, it reads as
   a stamp.

   No accent. The card already carries the vermilion rule across its head, and
   one accent per surface is the rule everywhere else on this site.
   ──────────────────────────────────────────────────────────────────────── */

export const STAMP = { width: 40, height: 24 } as const;

const STAMP_MONOGRAM = 28;
const STAMP_MONOGRAM_HEIGHT = (STAMP_MONOGRAM / CAP.width) * CAP.height;

export const STAMP_TRANSFORM = placeMark(
  (STAMP.width - STAMP_MONOGRAM) / 2,
  (STAMP.height - STAMP_MONOGRAM_HEIGHT) / 2,
  STAMP_MONOGRAM
);

/**
 * The stamp as a standalone SVG document, in flat colours.
 *
 * Flat because it has to be: the share cards are laid out by satori in Node,
 * where there is no stylesheet to reach for and no theme to follow.
 */
export function stampSvg(ink: string, frame: string): string {
  const { width: w, height: h } = STAMP;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">` +
    `<path fill="${ink}" transform="${STAMP_TRANSFORM}" d="${MARK_PATH}"/>` +
    `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" ` +
    `fill="none" stroke="${frame}" stroke-width="1"/>` +
    `</svg>`
  );
}

export interface IconColours {
  paper: string;
  ink: string;
  accent: string;
}

/**
 * The two themes, hard-coded.
 *
 * These are the only literal colours in the project, and they are here rather
 * than in a component on purpose: an icon is a standalone file with no access
 * to `src/styles/global.css`, and a PNG has no access to anything at all. They
 * are the sRGB values of `--paper`, `--ink` and `--accent`. If a token changes,
 * change it here too — `npm run check:contrast` cannot see this file.
 */
export const ICON_THEME: Record<'light' | 'dark', IconColours> = {
  light: { paper: '#ecebe9', ink: '#161d28', accent: '#324ebb' },
  dark: { paper: '#0e1114', ink: '#e6eaee', accent: '#8bb2f3' },
};

/**
 * The icon as a standalone SVG document.
 *
 * `theme: 'auto'` emits both palettes behind `prefers-color-scheme`, which is
 * what a browser tab wants. A fixed theme emits flat fills, which is what a
 * rasteriser needs — resvg does not resolve media queries, and iOS composites
 * the touch icon on its own background regardless of the user's setting.
 */
export function iconSvg(
  theme: 'auto' | 'light' | 'dark' = 'auto',
  label: string = identity.initials
): string {
  const v = MARK_VIEWBOX;
  const light = ICON_THEME.light;

  const head =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v} ${v}" ` +
    `role="img" aria-label="${label}">`;

  if (theme === 'auto') {
    const dark = ICON_THEME.dark;
    return (
      head +
      `<style>` +
      `.p{fill:${light.paper}}.i{fill:${light.ink}}.a{fill:${light.accent}}` +
      `@media(prefers-color-scheme:dark){` +
      `.p{fill:${dark.paper}}.i{fill:${dark.ink}}.a{fill:${dark.accent}}}` +
      `</style>` +
      `<rect class="p" width="${v}" height="${v}"/>` +
      `<rect class="a" width="${v}" height="${BAND}"/>` +
      `<path class="i" transform="${ICON_TRANSFORM}" d="${MARK_PATH}"/>` +
      `</svg>`
    );
  }

  const c = ICON_THEME[theme];
  return (
    head +
    `<rect fill="${c.paper}" width="${v}" height="${v}"/>` +
    `<rect fill="${c.accent}" width="${v}" height="${BAND}"/>` +
    `<path fill="${c.ink}" transform="${ICON_TRANSFORM}" d="${MARK_PATH}"/>` +
    `</svg>`
  );
}
