// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * The canonical public URL. Canonical tags, the sitemap, RSS, JSON-LD and the
 * Open Graph image URLs all derive from this single value, so a deployment to
 * a different origin needs no other change:
 *
 *   SITE_URL=https://example.com npm run build
 */
const SITE_URL = process.env.SITE_URL ?? 'https://samyamoyrakshit.com';

export default defineConfig({
  site: SITE_URL,

  // Prefetch on hover so navigation feels instant without shipping a router.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  /**
   * Astro's built-in Fonts API. It downloads the font files at build time,
   * self-hosts them, subsets them, emits `@font-face` with `size-adjust`
   * fallback metrics (which is what kills layout shift on font swap), and
   * generates the `<link rel="preload">` tags.
   *
   * Weights are written as *range strings* ("200 800") on purpose: that tells
   * Astro to fetch a single variable font file instead of one file per weight.
   *
   * NOTE the `--f-*` naming. Tailwind v4 owns the `--font-*` namespace (any
   * `--font-x` in `@theme` becomes a `font-x` utility), so keeping Astro's
   * raw font stacks under `--f-*` avoids a circular variable reference.
   * `src/styles/global.css` maps `--f-*` onto Tailwind's `--font-*`.
   */
  fonts: [
    /**
     * Inter — everything that is read: headings, body, navigation.
     *
     * Chosen from evidence rather than taste. A survey of the most-starred
     * personal-site repos on GitHub found no praised site using a distinctive
     * display face: chirpy sets Lato, al-folio a plain Google sans,
     * karpathy.ai the system stack, and bchiang7/v4 — the most-copied personal
     * developer site on GitHub — resolves to Inter.
     *
     * Inter is the closest open face to the system UI stack those sites lean
     * on, which is the point: on a portfolio the type should be the thing
     * nobody notices while reading the numbers. Hierarchy comes from weight
     * and tracking instead — headings at 600, roughly -0.02em to -0.03em.
     */
    {
      name: 'Inter',
      cssVariable: '--f-sans',
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
    /**
     * JetBrains Mono — figures, metadata, code, the specs strips.
     *
     * A face made to be compiled against rather than to decorate a label,
     * which suits a site whose argument is made in measurements.
     */
    {
      name: 'JetBrains Mono',
      cssVariable: '--f-mono',
      provider: fontProviders.google(),
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
    /**
     * Tiro Bangla — the epigraph on /blog/, and nothing else.
     *
     * Inter has no Bengali coverage, so without this the couplet falls through
     * to whatever the reader's OS happens to ship: Nirmala UI on Windows,
     * Kohinoor Bangla on macOS, Noto on Android. Three different faces at three
     * different apparent sizes beside the same Inter — which is precisely the
     * accidental mismatch this site's brief exists to avoid. It is set
     * deliberately or not at all.
     *
     * A text face rather than a UI one. Tiro Bangla was cut for the Murty
     * Classical Library of India and follows the proportions of the handset
     * metal type used by Kolkata publishing houses, which is what a Bengali
     * book of the couplet's period was actually set in. A monolinear signage
     * face — Noto Sans Bengali, the obvious neutral pick — makes the verse
     * read like a wayfinding sign.
     *
     * One weight, 400: all Google Fonts carries, and correct, since a fount of
     * hand-set metal type had one. `font-synthesis-weight: none` is set
     * globally, so requesting 600 silently returns 400.
     *
     * The `unicode-range` on the emitted @font-face is what keeps this cheap:
     * a browser only fetches a file when a codepoint inside that range is
     * actually painted, so every page but /blog/ pays a few hundred bytes of
     * CSS and no font bytes at all.
     *
     * `latin` is in the subset list because the verse contains word spaces and
     * an apostrophe, and neither is a Bengali codepoint. With `bengali` alone
     * they fall through to the metric-matched fallback — Arial at
     * `size-adjust: 122.9%` — which sets the word spaces ~30% wide and puts an
     * Arial apostrophe inside হ’।।. Two faces inside six words. The latin
     * subset costs ~10 kB and buys one coherent face for the whole band.
     */
    {
      name: 'Tiro Bangla',
      cssVariable: '--f-bengali',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      subsets: ['bengali', 'latin'],
      fallbacks: ['Nirmala UI', 'Shonar Bangla', 'Kohinoor Bangla', 'Bangla MN', 'serif'],
    },
  ],

  image: {
    // Generate these widths for responsive images.
    breakpoints: [420, 640, 860, 1080, 1400, 1920],
  },

  markdown: {
    /**
     * Maths, typeset at build time.
     *
     * `$...$` inline, `$$...$$` display. KaTeX runs here in Node and emits
     * plain HTML, so the browser is sent finished markup and no maths library
     * — the equations are already laid out before the page is requested, and
     * they render with JavaScript switched off.
     *
     * NOTE: changing anything in this `markdown` block does not invalidate the
     * render cache in `.astro/`. Delete that directory and rebuild, or the old
     * HTML keeps being served and the change looks like it silently failed.
     */
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          // Render the TeX source into the output for screen readers and for
          // anyone who wants to copy the actual expression back out.
          output: 'htmlAndMathml',
          // A malformed expression should show up in red in the page rather
          // than take the whole build down over a stray brace.
          throwOnError: false,
        },
      ],
    ],

    shikiConfig: {
      /**
       * `github-light-high-contrast` rather than plain `github-light`: the
       * standard theme's comment and keyword colours fall below WCAG AA on
       * this site's paper. Measured, not guessed — see `npm run check:contrast`,
       * which audits every token colour in both themes.
       */
      themes: { light: 'github-light-high-contrast', dark: 'github-dark-dimmed' },
      wrap: true,
      /**
       * Emit CSS custom properties only — no inline `color` or
       * `background-color` on the <pre>.
       *
       * With a default colour, Shiki writes `background-color:#fff` straight
       * onto the element, and an inline style beats every selector we could
       * write. The result is a white code block in dark mode. Turning this off
       * hands all colour control to src/styles/global.css, which is where the
       * rest of the design system lives anyway.
       */
      defaultColor: false,
    },
  },
});
