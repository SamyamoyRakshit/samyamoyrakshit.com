# Portfolio of Samyamoy Rakshit

Source for my personal site — professional work, projects, and writing.

I'm a data scientist at [Sigmoid Analytics](https://www.sigmoid.com/).
Alongside client work I implement machine learning papers from scratch — the
Transformer, BERT and ViT so far — and write about the process and the results.
The site brings that together with my professional experience and blog posts.

**Live:** [samyamoyrakshit.com](https://samyamoyrakshit.com)

Static output, no framework runtime in the browser, no analytics, no cookie
banner, no third-party requests at all. Built with [Astro](https://astro.build).

---

## The site

Four pages in the navigation — **/** · **/experience/** · **/projects/** ·
**/blog/** — plus `/blog/<post>/` and `/blog/tags/<tag>/`.

Content is shown in full on the page it belongs to: every role and its work is
on `/experience/`, and each project's results, stack and links are on
`/projects/`. Neither has separate detail pages — the long-form write-up for a
project is a blog post.

## Running it

Node 22.12 or newer.

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command                  | What it does                                                   |
| ------------------------ | -------------------------------------------------------------- |
| `npm run dev`            | Local preview at :4321, with drafts and placeholders shown.    |
| `npm run build`          | Builds to `dist/`.                                             |
| `npm run preview`        | Serves `dist/` — exactly what visitors get.                    |
| `npm run check`          | Type-checks everything. Held at 0 errors, 0 warnings, 0 hints. |
| `npm run check:contrast` | WCAG 2.2 AA audit of every colour pairing.                     |
| `npm run check:build`    | 14 checks against the built site. Exits 1 on failure.          |
| `npm run check:content`  | Lists any unfilled placeholders.                               |
| `npm run format`         | Formats everything with Prettier.                              |
| `npm run verify`         | All of the above, in order.                                    |

`npm run verify` is the deploy command, so a failure blocks the deploy rather
than shipping.

## How it's built

```
src/config/site.ts        identity, career, education, toolkit, SEO
src/content/work/*.md     one rebuilt paper per file
src/content/blog/*.md     one post per file
src/styles/global.css     the whole design system: colour, type, motion
src/components/           presentational pieces
src/pages/                routes, plus the OG image generator
src/lib/content.ts        all content queries
src/lib/mark.ts           the logo — icons and share cards render from here
scripts/                  the contrast, build and content audits
og-fonts/                 TTFs used to draw share images at build time
```

Adding content is one Markdown file — no registry to update, no code to touch.
`src/content/work/<name>.md` becomes a box on `/projects/`;
`src/content/blog/<name>.md` becomes a post and enters the RSS feed. Both
support `draft: true`, which shows in dev and is excluded from the build.
[CONTENT.md](CONTENT.md) has the frontmatter reference.

### Generated at build time

Wired into the build, so they stay correct as content is added:

- **Share images** drawn per page with satori, in the site's own typefaces.
- **`sitemap-index.xml`**, **`rss.xml`**, **`robots.txt`** and **`llms.txt`** —
  the last a plain-text map of the site for AI assistants.
- **JSON-LD** (`Person` + `WebSite` + `BlogPosting`).
- **Favicon and touch icon**, rendered from the same source as the share-card
  stamp, so there is only ever one drawing of the mark.
- **Light and dark themes** following the OS by default, with a toggle that
  persists and no flash on load.
- **Self-hosted fonts**, subset and preloaded, with fallback metrics so text
  doesn't jump as they load.
- **Security headers** for Vercel, Netlify and Cloudflare.

### Design system

Colour is defined once per token in `src/styles/global.css` using
`light-dark()`, so switching theme is a single `color-scheme` change rather
than a duplicated stylesheet. Type is a fluid `clamp()` scale — nothing jumps
at a breakpoint. A list item is an **object**: its own lighter ground, a 1px
border, a small radius and a shadow that lifts on hover, which is what makes a
long index scannable. The page ground is a _neutral_ grey rather than the
blue-white most templates ship, and the ultramarine accent is reserved strictly
for things that can be interacted with, so colour always means "you can act
here". Three typefaces, one job each: **Inter** is read, **JetBrains Mono**
counts, and **Tiro Bangla** sets the Bengali couplet on `/blog/`. Motion runs
on one duration ladder and only ever animates `transform` and `opacity`;
scroll-driven reveals sit behind both `@supports` and `prefers-reduced-motion`,
so a browser without scroll timelines gets the finished page rather than a
blank one.

### Testing

Two things a type-checker structurally cannot catch, so both are scripted:

**`check:contrast`** parses the OKLCH tokens straight out of the CSS and fails
below WCAG 2.2 AA. It caught two real defects during the initial build. It also
verifies the 13 colours hard-coded in the three files that cannot read the
stylesheet — the favicon, the share-card generator and the `theme-color` meta
tags — against the tokens they duplicate, because keeping those in sync by hand
had already failed once.

**`check:build`** reads the finished `dist/` rather than the source, so it sees
the site the way a browser does: dead internal links, a skipped heading level,
an image with no `alt`, a draft that escaped, a canonical pointing at the wrong
page, a duplicated `<title>`, a missing `og:image`. Every one of its checks has
been verified by deliberately breaking the output and confirming the check goes
red — a check that has never failed is not known to work.

## Troubleshooting

Known failure modes and their fixes are in
**[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** — the dev server exiting with no
usable error, a Markdown change that will not appear, `EPERM` on install. Each
entry leads with the message you would actually see.

## Licence

The code is MIT — see [LICENSE](LICENSE) — so the components, the design
system, the build-time OG generator and the audit scripts are free to reuse.

The **written content** (everything in `src/content/`, the copy in
`src/config/site.ts`) and the **photograph** are not covered by it, and remain
my copyright. Please don't redeploy this as your own site. See
[NOTICE](NOTICE) for the full carve-out, including third-party font licences.
