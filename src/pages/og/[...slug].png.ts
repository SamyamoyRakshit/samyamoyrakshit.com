import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { identity, isPlaceholder, SITE_URL } from '../../config/site';
import { getWork, getBlogPosts, formatDate } from '../../lib/content';
import { STAMP, stampSvg } from '../../lib/mark';

/**
 * Social share images, generated at build time.
 *
 * Every page gets a real card set in the site's own typefaces rather than a
 * single generic screenshot: satori lays the card out with the actual TTFs and
 * resvg rasterises it to PNG. Nothing is fetched at runtime and nothing is
 * rendered in a browser — this is pure Node during `npm run build`.
 *
 * Routes produced:
 *   /og/default.png
 *   /og/work-<id>.png
 *   /og/blog-<id>.png
 */

const WIDTH = 1200;
const HEIGHT = 630;

// The light theme, hard-coded: a share card has no colour-scheme context.
// These are the sRGB values of the light half of --paper, --ink, --ink-faint,
// --rule and --accent. `check:contrast` asserts they still match the tokens.
const PAPER = '#ecebe9';
const INK = '#161d28';
const FAINT = '#5a616b';
const RULE = '#d4d3d1';
const ACCENT = '#324ebb';

/**
 * Resolved from the project root rather than `import.meta.url`: Vite rewrites
 * module-relative URLs into the bundled output, which would point at a path
 * that does not exist at build time. `og-fonts/` also sits outside `src/` so
 * Vite's asset pipeline leaves the TTFs alone — they are build inputs, not
 * things to ship to the browser.
 */
const fontPath = (file: string) => resolve(process.cwd(), 'og-fonts', file);

const fonts = await Promise.all([
  readFile(fontPath('Inter-SemiBold.ttf')),
  readFile(fontPath('Inter-Regular.ttf')),
  readFile(fontPath('JetBrainsMono-Regular.ttf')),
]).then(([display, body, mono]) => [
  { name: 'Inter', data: display, weight: 600 as const, style: 'normal' as const },
  { name: 'Inter', data: body, weight: 400 as const, style: 'normal' as const },
  { name: 'JetBrains Mono', data: mono, weight: 400 as const, style: 'normal' as const },
]);

/**
 * The mark, sat in the head of the card opposite the kicker.
 *
 * Embedded as a data URI rather than redrawn here, so the card, the tab icon
 * and the stamp in the site header are all literally the same artwork.
 */
const MARK_HEIGHT = 62;
const MARK_WIDTH = Math.round((MARK_HEIGHT * STAMP.width) / STAMP.height);
const MARK_URI = `data:image/svg+xml;base64,${Buffer.from(stampSvg(INK, FAINT)).toString(
  'base64'
)}`;

interface CardData {
  /** Small mono line above the title. */
  kicker: string;
  title: string;
  /** Small mono line below the rule at the foot. */
  meta: string;
  /** Foot, left. The name on interior pages; the domain on the homepage,
   *  where the name is already the headline and repeating it is noise. */
  foot: string;
}

/** Satori takes a React-shaped tree; we build it as plain objects. */
const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style, children },
});

function card({ kicker, title, meta, foot }: CardData) {
  const mono = {
    fontFamily: 'JetBrains Mono',
    fontSize: 22,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
  };

  // Long titles need to step down or they overflow the card.
  const titleSize = title.length > 68 ? 64 : title.length > 42 ? 78 : 94;

  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: PAPER,
      padding: '64px 72px',
      position: 'relative',
    },
    [
      // The accent bar across the top — the one piece of colour.
      el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        width: WIDTH,
        height: 10,
        backgroundColor: ACCENT,
      }),

      // Kicker, with the mark opposite it
      el(
        'div',
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 12,
        },
        [
          el('div', { display: 'flex', ...mono, color: FAINT }, kicker),
          {
            type: 'img',
            props: {
              src: MARK_URI,
              width: MARK_WIDTH,
              height: MARK_HEIGHT,
              style: { display: 'flex' },
            },
          },
        ]
      ),

      el('div', {
        display: 'flex',
        width: '100%',
        height: 1,
        backgroundColor: RULE,
        marginTop: 22,
      }),

      // Title
      el(
        'div',
        {
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: titleSize,
          lineHeight: 1.1,
          // Inter is spaced for UI text, so a card-sized title needs pulling in.
          letterSpacing: -1.6,
          color: INK,
          paddingTop: 24,
          paddingBottom: 24,
        },
        title
      ),

      el('div', {
        display: 'flex',
        width: '100%',
        height: 1,
        backgroundColor: RULE,
      }),

      // Foot: the name, and the page's own metadata
      el(
        'div',
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 22,
        },
        [
          el('div', { display: 'flex', ...mono, color: INK }, foot),
          el('div', { display: 'flex', ...mono, color: FAINT }, meta),
        ]
      ),
    ]
  );
}

async function render(data: CardData): Promise<Buffer> {
  const svg = await satori(card(data) as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng();

  return png;
}

export async function getStaticPaths() {
  const [work, posts] = await Promise.all([getWork(), getBlogPosts()]);

  const role = isPlaceholder(identity.role) ? 'Personal site' : identity.role;

  // `getStaticPaths` is not handed the site URL the way a page is, so it comes
  // from the config — which reads `import.meta.env.SITE`, the same value.
  const host = (() => {
    try {
      return new URL(SITE_URL).host;
    } catch {
      return '';
    }
  })();

  const paths: { params: { slug: string }; props: CardData }[] = [
    {
      params: { slug: 'default' },
      props: {
        kicker: role,
        title: identity.name,
        foot: host,
        // Counted at build time rather than typed out, so it cannot go stale.
        meta: (() => {
          const n = work.filter((e) => e.data.kind === 'scratch').length;
          return n > 0 ? `${n} rebuilt from scratch` : '';
        })(),
      },
    },
  ];

  /* No per-rebuild cards. There is no /projects/<id>/ page for one to belong
     to — each rebuild is a box on /projects/, and a share of that URL is a
     share of the whole page, which is what /og/default.png is for. */

  for (const entry of posts) {
    paths.push({
      params: { slug: `blog-${entry.id}` },
      props: {
        kicker: 'Writing',
        title: entry.data.title,
        foot: identity.name,
        meta: formatDate(entry.data.pubDate),
      },
    });
  }

  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const png = await render(props as unknown as CardData);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
