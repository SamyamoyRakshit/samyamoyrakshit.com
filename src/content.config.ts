import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content collections.
 *
 * Each project and each blog post is one Markdown file. Adding a file is the
 * whole operation — there is no registry to update and no component to write.
 *
 *   src/content/work/<name>.md   -> a box on /projects/, anchored #<name>
 *   src/content/blog/<name>.md   -> a post at /blog/<name>/, and the RSS feed
 *
 * Note the asymmetry: work entries have no page of their own. Their Markdown
 * bodies are never rendered — the frontmatter drives the box on /projects/ and
 * the body is the draft of the post.
 *
 * The schemas are enforced at build time, so a mistyped or missing field fails
 * the build with the exact file and field name rather than shipping a broken
 * page. CONTENT.md carries a copyable template.
 */

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      /** Project name. */
      title: z.string(),

      /**
       * Which of the two things this is.
       *
       * 'scratch' — a published model rebuilt from the paper, by hand.
       * 'work'    — something built for an employer or a client.
       *
       * Listed separately because they answer different questions, and a
       * portfolio that blends them answers neither.
       */
      kind: z.enum(['scratch', 'work']).default('work'),

      /**
       * What to call it in a heading, when the full title is too long to be one.
       *
       * 'BERT', 'Transformer', 'ViT' — the names the repo's own folders use. It
       * exists because the citation sits directly under the heading, so a card
       * headed "Attention Is All You Need" above a citation reading *Attention
       * Is All You Need* says the same thing twice. Falls back to the title with
       * a trailing ", from scratch" removed.
       */
      short: z.string().optional(),

      /**
       * For a rebuild: the paper it came from. The point of reimplementing a
       * paper is having read it, and the citation is the evidence.
       */
      paper: z
        .object({
          /** The paper's own title, if it differs from yours. */
          title: z.string(),
          /** First author et al., e.g. 'Vaswani et al.' */
          authors: z.string(),
          /** Publication year of the paper, not of the rebuild. */
          year: z.string(),
          url: z.url().optional(),
        })
        .optional(),

      /**
       * The numbers, for a rebuild. Shown as a strip under the summary.
       *
       * The most interesting thing on the page to an engineer reading it —
       * "65M params · M1 Air 16GB · 9h · ~600 lines" tells a
       * engineer more than three paragraphs of prose. Free-form on purpose:
       * put whatever the honest figures are for that build.
       */
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),

      /** One sentence, shown in the index. Lead with what it does, not how. */
      summary: z.string(),

      /**
       * The two or three lines that carry the whole project, shown *on the
       * index* rather than inside the case study.
       *
       * Nobody should have to click through to find out whether a project is
       * interesting. The write-up is for the reader who is already convinced;
       * these bullets are what convince them. Put the numbers here.
       */
      highlights: z.array(z.string()).default([]),

      /** Year or range, shown in the index margin. e.g. '2026' or '2024-25'. */
      year: z.string(),

      /** The specific contribution. Recruiters look for this. */
      role: z.string().optional(),

      /** Shown as outlined tags. Keep to ~5; this is not a keyword dump. */
      stack: z.array(z.string()).default([]),

      /** Optional links. Any you omit simply don't render. */
      links: z
        .object({
          live: z.url().optional(),
          repo: z.url().optional(),
          writeup: z.url().optional(),
        })
        .default({}),

      /** Optional cover image — put the file next to the .md and reference it. */
      cover: image().optional(),
      coverAlt: z.string().optional(),

      /** Lower numbers sort first. Ties fall back to reverse-chronological. */
      order: z.number().default(0),

      /** Featured projects appear on the homepage. Keep this to 3. */
      featured: z.boolean().default(false),

      /** Drafts are visible in `npm run dev` but excluded from the build. */
      draft: z.boolean().default(false),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),

      /** Used in the index, the RSS feed, and the meta description. */
      description: z.string(),

      /**
       * Optional. Groups several posts into one ordered piece.
       *
       * A rebuild writeup does not want to be one forty-minute page — it wants
       * to be four posts someone can start, leave, and come back to. Give each
       * part the same `name` and its own `part` number, and the site builds the
       * contents list at the foot of each one.
       *
       *   series: { name: "Attention from scratch", part: 2 }
       */
      series: z
        .object({
          name: z.string(),
          part: z.number().int().positive(),
        })
        .optional(),

      /** YYYY-MM-DD. Drives sort order and the RSS feed. */
      pubDate: z.coerce.date(),

      /** Set only if you meaningfully revise a published post. */
      updatedDate: z.coerce.date().optional(),

      tags: z.array(z.string()).default([]),

      cover: image().optional(),
      coverAlt: z.string().optional(),

      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { work, blog };
