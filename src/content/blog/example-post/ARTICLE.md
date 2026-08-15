---
title: Example Post
description: Delete this file once you have something real to publish. It shows the shape of a post and what the styling does.
pubDate: 2026-08-05
tags: [notes]
draft: true
---

The frontmatter above is the whole configuration for a post. `title`,
`description` and `pubDate` are required; `tags`, `updatedDate`, `cover` and
`featured` are optional.

## Headings get a rule

Every `##` heading draws a hairline above itself, which is what gives long
posts their structure without needing any decoration.

Body text sits at a comfortable measure and stops at about 68 characters per
line, because that is roughly where reading speed peaks.

### Smaller headings don't

`###` is quieter — no rule, less space above.

Inline styling works as you'd expect: **bold**, *italic*, `inline code`, and
[links](https://example.com) that thicken their underline when hovered.

> Pull quotes are set in the serif, in italic, against an accent rule. Use them
> for something worth stopping on, not for every third paragraph.

- Bulleted lists use an em dash in the accent colour
- Rather than a round bullet
- Which keeps the page consistent with the rest of the ledger

1. Numbered lists set their markers in the monospace face
2. So they line up with the metadata elsewhere on the site

```ts
// Code blocks are syntax-highlighted at build time by Shiki.
// No highlighting library is shipped to the browser.
export function greet(name: string): string {
  return `Hello, ${name}`;
}
```

Images get a hairline border automatically, and are optimised into modern
formats at build time when you reference them from `src/`.

---

**To publish:** set `draft: false`. The post then appears on `/blog/`, on the
homepage, in `/rss.xml`, in the sitemap, and gets its own generated social
share image.
