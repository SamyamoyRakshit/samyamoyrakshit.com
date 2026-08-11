# Adding content

Two kinds of content, one Markdown file each. Drop the file in the right folder
and it appears everywhere it should — index page, homepage, sitemap, RSS,
`llms.txt`, and its own generated share image. There is no list to update.

If a field is wrong or missing, `npm run build` tells you the exact file and
field rather than shipping a broken page.

---

## A project

Create `src/content/work/<name>.md`. The filename becomes the anchor of its box
on `/projects/`, so keep it lowercase, hyphenated and undated:
`spending-tracker.md` → `/projects/#spending-tracker`.

**There are no per-project pages.** Everything a project has is in its box on
`/projects/` — the numbers, the bullets, the stack, the links out. The body of
the Markdown file is not rendered anywhere; keep it as the draft of the post
you will write, and publish that in `src/content/blog/`.

**Employment does not go here.** Roles, and what you did in them, live in
`career` in `src/config/site.ts` and render on `/experience/` with every bullet
on the page. This folder is for things you built.

```markdown
---
title: Spending Tracker
summary: Reads bank SMS alerts and turns them into a monthly budget I actually look at.
year: '2026'
role: Design and engineering
stack: [TypeScript, Astro, PostgreSQL]
links:
  live: https://example.com
  repo: https://github.com/you/repo
order: 1
featured: true
draft: true
---

## What it is

One paragraph. Start with the thing itself.

## The constraint

What bounded the work — time, team size, something you couldn't change. This is
the most useful sentence in any case study, because without it every project
reads as though it went smoothly.

## What I did

Your part specifically, distinct from anyone else's.

## What changed

Numbers if you have them. If not, what became possible that wasn't before.
```

| Field                | Required | Notes                                                                                            |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `title`              | yes      |                                                                                                  |
| `short`              | no       | What the box is headed. `BERT`, `Transformer`, `ViT`. Use it when the title repeats the paper's. |
| `kind`               | no       | `scratch` or `work`. Default `work`. See below.                                                  |
| `paper`              | no       | Only for `kind: scratch`. `title`, `authors`, `year`, `url`.                                     |
| `specs`              | no       | Only for `kind: scratch`. `- { label: Params, value: "65M" }`.                                   |
| `summary`            | yes      | One sentence, shown in the box.                                                                  |
| `highlights`         | no       | 2–3 bullets shown **in the box**. Put the numbers here — see below.                              |
| `year`               | yes      | Quoted: `"2026"` or `"2024-25"`.                                                                 |
| `role`               | no       | What _you_ did. Recruiters look for this.                                                        |
| `stack`              | no       | Cap at five. It's not a keyword dump.                                                            |
| `links`              | no       | Any of `live`, `repo`, `writeup`. Must be full URLs.                                             |
| `cover` / `coverAlt` | no       | Image beside the `.md`; alt text required with it.                                               |
| `order`              | no       | Lower sorts first. Default 0.                                                                    |
| `featured`           | no       | Shows on the homepage. Keep to **three**.                                                        |
| `draft`              | no       | `true` = visible in dev, excluded from the built site.                                           |

### The two kinds of project

`kind: work` is something you built for an employer or a client. `kind: scratch`
is a published model you rebuilt from the paper. They are listed in separate
sections, in that order of prominence, because they answer different questions —
one shows what you can be trusted with, the other shows what you do when nobody
is asking.

A `scratch` entry is set as a bibliography entry: the **paper's** year in the
margin, the citation under the title, and the `specs` strip beneath the summary.

```yaml
kind: scratch
paper:
  title: Attention Is All You Need
  authors: Vaswani et al.
  year: '2017'
  url: https://arxiv.org/abs/1706.03762
specs:
  - { label: Params, value: '65M' }
  - { label: Hardware, value: 'M1 Air, 16GB' }
  - { label: Trained, value: '9h' }
  - { label: Code, value: '~600 lines' }
```

The specs strip is the most-read thing on the page for the people you want
reading it. Put the honest numbers in — including the unflattering ones.

### `highlights` — the bullets that show on the index

Two or three lines, directly under the specs strip, **on the index page
itself**:

```yaml
highlights:
  - Pre-trained a 7.5M-parameter BERT from scratch on 114 MB of Bengali Wikipedia — MLM + NSP, ~28 hours on laptop MPS.
  - 86.5% test accuracy on 6-class Bengali news — above published mBERT (80.2, at 110M params) and IndicBERT (78.5).
```

Nobody should have to open a page to find out whether it is worth opening. The
write-up in the body is for the reader you have already convinced; these are
the lines that convince them. If a fact is the reason the project is
interesting, it belongs here and not only in the body.

---

## A post

Create `src/content/blog/<name>.md`.

```markdown
---
title: Why I stopped using ORMs
description: One sentence. This is the meta description and the RSS summary.
pubDate: 2026-08-05
tags: [databases, postgres]
draft: true
---

Write normally. `##` headings draw a hairline above themselves; `###` are
quieter. Code fences are syntax-highlighted at build time, so no highlighting
library is sent to the browser.
```

| Field                | Required | Notes                                                                                |
| -------------------- | -------- | ------------------------------------------------------------------------------------ |
| `title`              | yes      |                                                                                      |
| `description`        | yes      | Used for SEO, link previews and RSS. Write it for a person deciding whether to read. |
| `series`             | no       | `{ name: "Attention from scratch", part: 2 }`. See below.                            |
| `pubDate`            | yes      | `YYYY-MM-DD`. Sorts the index and the feed.                                          |
| `updatedDate`        | no       | Only for meaningful revisions.                                                       |
| `tags`               | no       |                                                                                      |
| `cover` / `coverAlt` | no       |                                                                                      |
| `featured`           | no       |                                                                                      |
| `draft`              | no       | Same as above.                                                                       |

### Splitting a long post into a series

A forty-minute post is a post most people close. Four ten-minute parts is
something they can start on a train, leave, and come back to — and it gives you
four things to share instead of one.

Give every part the same `name` and its own `part` number:

```yaml
series: { name: 'Attention from scratch', part: 2 }
```

Each part then carries a numbered contents list of the whole series at its foot,
with the current part marked. Parts are ordered by `part`, not by date, so you
can publish them out of order or go back and insert one.

### What Markdown you can use

All of GitHub-flavoured Markdown works, and every part of it is styled to match
the site. There is a live example of the lot at **`/blog/markdown-reference/`**
when you run `npm run dev` — it is a permanent draft, so it never publishes.
Open it whenever you want to check how something will look.

| Feature                                      | Notes                                                                                                                                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Headings `##`–`######`                       | `##` draws a hairline; each level has a distinct size. Headings get a linkable anchor on hover.                                                                                          |
| Bold, italic, strikethrough                  | Standard `**`, `*`, `~~`.                                                                                                                                                                |
| Links                                        | Bare URLs autolink. The underline thickens on hover.                                                                                                                                     |
| Bullet lists                                 | Marked with an em dash in the accent colour. Nests to any depth.                                                                                                                         |
| Numbered lists                               | Markers set in the monospace face.                                                                                                                                                       |
| Task lists                                   | `- [x]` / `- [ ]` render real checkboxes.                                                                                                                                                |
| Tables                                       | Ruled monospace header, hairline rows. Alignment (`:---:`) works.                                                                                                                        |
| Maths                                        | `$inline$` and `$$display$$`, typeset at build time by KaTeX. No maths library reaches the browser and equations render with JavaScript off. Wide equations scroll inside their own box. |
| Code fences                                  | Highlighted at build time by Shiki, correct in both themes. Long lines scroll inside the block.                                                                                          |
| Blockquotes                                  | Large serif italic against an accent rule.                                                                                                                                               |
| Footnotes                                    | `[^1]` — gathered into a smaller section at the foot of the post.                                                                                                                        |
| `<kbd>` `<mark>` `<details>` `<sub>` `<sup>` | Raw HTML works and is styled.                                                                                                                                                            |
| Definition lists                             | **Not** supported — use a two-column table.                                                                                                                                              |

If you want a chart, a live demo, or anything interactive inside a post, rename
the file from `.md` to `.mdx` — then you can import components into it.

---

## Images

Put the image next to the Markdown file and reference it relatively:

```markdown
---
cover: ./screenshot.png
coverAlt: The budget screen showing a month of categorised transactions.
---
```

Astro converts it to modern formats, generates the right sizes, and sets
`width`/`height` so the page doesn't jump while it loads. Always write real
`coverAlt` text — if the image is purely decorative, leave it out entirely
rather than describing it badly.

A cover also becomes the thumbnail on the index pages, which is the single
cheapest way to stop a list of links reading as a list of links. For a rebuild,
the obvious cover is a figure you generated yourself — an attention map, a loss
curve, a patch grid. A real plot from your own run is worth more here than any
stock image, and it is evidence as well as decoration.

### Your photo

Separately from content covers: put a photo of yourself at `public/portrait.jpg`
and set `identity.portrait` to `'/portrait.jpg'` in `src/config/site.ts`. It
appears beside your name on the homepage, greyscale until the page is hovered.
Leave it `''` and nothing renders.

Inside the body, normal Markdown works: `![alt text](./diagram.png)`.

---

## Publishing

1. Write it with `draft: true`.
2. `npm run dev` and read it on the page.
3. Set `draft: false`.
4. `npm run verify`, then push.

## A note on how much to put here

Three to five projects is the right number. You are judged by the weakest item
on the page, so cutting is usually the highest-value edit you can make — a
short, specific portfolio beats a long, padded one every time.

The same applies to the blog: one post you actually thought about is worth
more than six posts that restate their own introductions.
