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

## Inline SVG diagrams

Raw HTML passes through, so a diagram can be hand-drawn as SVG in the post
itself. Every colour reads a site token first with the light value as a
fallback, so it themes with the toggle here and still renders as a light card
in a plain Markdown preview or on GitHub.

<style>
  .dgm{background:var(--code-bg, oklch(0.97 0.0022 95));border:1px solid var(--rule, oklch(0.868 0.0038 95));border-radius:14px;padding:20px 14px;overflow-x:auto;margin:1.6rem 0}
  .dgm svg{display:block;width:100%;height:auto;margin:0 auto}
  .dgm text{font-family:var(--f-mono, ui-monospace,SFMono-Regular,Menlo,monospace)}
  .dg-bn{font-family:var(--f-bengali, "Nirmala UI","Shonar Bangla","Bangla MN",serif)}
  .dg-lbl{font-size:14px;font-weight:600}
  .dg-sub{font-size:11px}
  .dg-tag{font-size:10.5px;letter-spacing:.04em}
  .dg-hd{font-size:13px;font-weight:700;letter-spacing:.12em}
  .dg-num{font-size:12.5px;font-weight:700;fill:var(--ink, oklch(0.23 0.023 258))}
  .dg-numbg{fill:var(--code-bg, oklch(0.97 0.0022 95))}
  .dg-c{text-anchor:middle}
  .dg-ink{fill:var(--ink, oklch(0.23 0.023 258))} .dg-mut{fill:var(--ink-muted, oklch(0.42 0.021 258))}
  .dg-amber{fill:var(--tint-amber-bg, oklch(0.942 0.042 85));stroke:var(--tint-amber-fg, oklch(0.445 0.09 65));stroke-width:1.4} .dg-xamber{fill:var(--tint-amber-fg, oklch(0.445 0.09 65))}
  .dg-sky{fill:var(--tint-sky-bg, oklch(0.933 0.033 245));stroke:var(--tint-sky-fg, oklch(0.435 0.114 250));stroke-width:1.4} .dg-xsky{fill:var(--tint-sky-fg, oklch(0.435 0.114 250))}
  .dg-violet{fill:var(--tint-violet-bg, oklch(0.933 0.031 300));stroke:var(--tint-violet-fg, oklch(0.44 0.145 300));stroke-width:1.4} .dg-xviolet{fill:var(--tint-violet-fg, oklch(0.44 0.145 300))}
  .dg-mintbox{fill:var(--tint-mint-bg, oklch(0.933 0.035 165));stroke:var(--tint-mint-fg, oklch(0.42 0.081 168));stroke-width:1.4} .dg-xmint{fill:var(--tint-mint-fg, oklch(0.42 0.081 168))}
  .dg-node{fill:var(--paper-sunken, oklch(0.902 0.0034 95));stroke:var(--rule, oklch(0.868 0.0038 95));stroke-width:1.3} .dg-xnode{fill:var(--ink-muted, oklch(0.42 0.021 258))}
  .dg-group{fill:none;stroke:var(--rule-strong, oklch(0.615 0.006 95));stroke-width:1.3;stroke-dasharray:5 4}
  /* Each line's arrowhead fill sits on the same row as its stroke. They are a
     pair — see the note on the markers below for why the arrowhead cannot read
     the line's own colour. Recolour a line and recolour its head. */
  .dg-flow{fill:none;stroke:var(--ink-muted, oklch(0.42 0.021 258));stroke-width:1.8;stroke-linecap:round} .dg-ahflow{fill:var(--ink-muted, oklch(0.42 0.021 258))}
  .dg-res{fill:none;stroke:var(--tint-mint-fg, oklch(0.42 0.081 168));stroke-width:1.8;stroke-linecap:round} .dg-rest,.dg-ahres{fill:var(--tint-mint-fg, oklch(0.42 0.081 168))}
  .dg-mem{fill:none;stroke:var(--accent, oklch(0.47 0.175 268));stroke-width:2.4;stroke-linecap:round} .dg-memt,.dg-ahmem{fill:var(--accent, oklch(0.47 0.175 268))}
  .dg-leafok{fill:var(--tint-mint-bg, oklch(0.933 0.035 165));stroke:var(--tint-mint-fg, oklch(0.42 0.081 168));stroke-width:1.4}
  .dg-leafno{fill:var(--paper-sunken, oklch(0.902 0.0034 95));stroke:var(--rule, oklch(0.868 0.0038 95));stroke-width:1.4;stroke-dasharray:4 4}
  .dg-pruned{fill:none;stroke:var(--rule-strong, oklch(0.615 0.006 95));stroke-width:1.5;stroke-dasharray:4 4} .dg-ahpruned{fill:var(--rule-strong, oklch(0.615 0.006 95))}
</style>
<!-- One arrowhead per line colour, which is four copies of the same triangle.

     It was one marker filled with `context-stroke` — a keyword that paints the
     head in the stroke of whichever path referenced it, so a single definition
     served every colour. Safari does not implement it, and an unrecognised
     paint value falls back to black: every residual and every memory arrow
     ended in a black head on a green or ultramarine line, in both themes,
     while Chrome and Firefox drew it correctly.

     There is no one-marker fix. A marker's contents inherit from where the
     marker is DEFINED, not from the path that uses it, so `currentColor` reads
     this hidden svg rather than the line and lands on the same problem. -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <marker id="dgah" viewBox="0 0 9 9" refX="7.5" refY="4.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path class="dg-ahflow" d="M0,0 L9,4.5 L0,9 z"/></marker>
  <marker id="dgah-res" viewBox="0 0 9 9" refX="7.5" refY="4.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path class="dg-ahres" d="M0,0 L9,4.5 L0,9 z"/></marker>
  <marker id="dgah-mem" viewBox="0 0 9 9" refX="7.5" refY="4.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path class="dg-ahmem" d="M0,0 L9,4.5 L0,9 z"/></marker>
  <marker id="dgah-pruned" viewBox="0 0 9 9" refX="7.5" refY="4.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path class="dg-ahpruned" d="M0,0 L9,4.5 L0,9 z"/></marker>
</defs></svg>

<figure class="dgm">
  <svg viewBox="0 0 700 180" role="img" aria-label="English is read by the encoder into memory, which the decoder uses to generate Bengali.">
    <text class="dg-lbl dg-ink dg-c" x="72" y="84">"We are friends"</text>
    <text class="dg-tag dg-mut dg-c" x="72" y="104">ENGLISH</text>
    <path class="dg-flow" d="M144,90 H186" marker-end="url(#dgah)"/>
    <rect class="dg-node" x="194" y="54" width="138" height="72" rx="12"/>
    <text class="dg-hd dg-ink dg-c" x="263" y="86">ENCODER</text>
    <text class="dg-sub dg-mut dg-c" x="263" y="106">self-attn + FFN · ×N</text>
    <path class="dg-mem" d="M332,90 H404" marker-end="url(#dgah-mem)"/>
    <text class="dg-tag dg-memt dg-c" x="369" y="80">memory · K,V</text>
    <rect class="dg-node" x="412" y="54" width="150" height="72" rx="12"/>
    <text class="dg-hd dg-ink dg-c" x="487" y="84">DECODER</text>
    <text class="dg-sub dg-mut dg-c" x="487" y="103">masked + cross-attn</text>
    <text class="dg-sub dg-mut dg-c" x="487" y="118">+ FFN · ×N</text>
    <path class="dg-flow" d="M562,90 H610" marker-end="url(#dgah)"/>
    <text class="dg-lbl dg-ink dg-bn dg-c" x="650" y="84">আমরা বন্ধু</text>
    <text class="dg-tag dg-mut dg-c" x="650" y="104">BENGALI</text>
  </svg>
</figure>

---

**To publish:** set `draft: false`. The post then appears on `/blog/`, on the
homepage, in `/rss.xml`, in the sitemap, and gets its own generated social
share image.
