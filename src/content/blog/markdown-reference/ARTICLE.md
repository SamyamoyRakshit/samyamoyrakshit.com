---
title: Markdown reference
description: Every Markdown feature this site supports, on one page. Kept as a draft so it never publishes — open it in dev whenever you want to check how something will look.
pubDate: 2026-08-06
tags: [reference, markdown]
draft: true
---

This post exists to prove every Markdown feature renders correctly. It is
permanently `draft: true`, so it shows up in `npm run dev` and never on the
live site. Keep it. When you're unsure how something will look, look here.

## Headings

Second-level headings draw a hairline above themselves.

### Third level

Quieter, no rule.

#### Fourth level

Smaller again.

##### Fifth level

###### Sixth level

## Text

Regular paragraph text with **bold**, *italic*, ***bold italic***,
~~strikethrough~~, `inline code`, and a [link to somewhere](https://example.com).

Here is a much longer paragraph so line length and rhythm can be judged
properly. Body copy is capped at roughly 68 characters per line, which is about
where reading speed peaks for most people. Below that, the eye jumps too often;
above it, the return sweep starts losing its place on the way back to the left
margin.

A line ending in two spaces  
forces a hard break like this.

Bare URLs should autolink: https://astro.build

Special characters: & < > " ' © — – … ₹ ° ± × ÷ ≈ ≠ ≤ ≥ → ← ↑ ↓

## Lists

Unordered lists use an em dash in the accent colour:

- First item
- Second item, with a longer line so wrapping behaviour inside a list item is
  visible and can be checked against the surrounding paragraph rhythm
- Third item
  - Nested item
  - Another nested item
    - Third level
- Back to the top level

Ordered lists set their numbers in the monospace face:

1. First step
2. Second step
   1. Sub-step
   2. Another sub-step
3. Third step

Task lists:

- [x] Something already done
- [ ] Something still to do
- [ ] Another thing

## Quotes

> A blockquote is set in the serif, in italic, against an accent rule. Use it
> for something worth stopping on.

> Multi-paragraph quotes work too.
>
> This is the second paragraph inside the same quote.

## Code

Inline `const x = 1` sits in the body.

```ts
// TypeScript, highlighted at build time by Shiki
interface Post {
  title: string;
  pubDate: Date;
  tags: string[];
}

export function isRecent(post: Post): boolean {
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - post.pubDate.getTime() < thirtyDays;
}
```

```python
# Python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

```bash
# Shell
npm run build && npm run preview
```

```
Plain code block with no language set.
No highlighting, just monospace.
```

A very long line inside a code block, to confirm it scrolls horizontally inside its own box rather than stretching the page:

```js
const aVeryLongLine = "this line is deliberately far too long to fit inside the measure so that horizontal overflow behaviour can be verified properly";
```

## Tables

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | Shown in the index |
| `description` | string | yes | Used for SEO and RSS |
| `pubDate` | date | yes | `YYYY-MM-DD` |
| `tags` | array | no | Lowercase, short |
| `draft` | boolean | no | Excluded from the build |

Alignment:

| Left | Centre | Right |
| :--- | :----: | ----: |
| a | b | 1 |
| longer cell | centred | 1000 |

## Rules

Three dashes make a horizontal rule:

---

## Footnotes

Some claim that needs a source.[^1] And another one.[^note]

[^1]: The first footnote, at the bottom of the page.
[^note]: Footnotes can have text labels too.

## HTML

Raw HTML passes through: <kbd>Ctrl</kbd> + <kbd>C</kbd>, <mark>highlighted
text</mark>, <sub>subscript</sub> and <sup>superscript</sup>.

<details>
<summary>A collapsible section</summary>

Hidden content, revealed on click. Useful for long asides and appendices.

</details>

## Images

Every post is a folder with an `images/` directory in it. Drop the file there
and reference it relatively:

```markdown
![A real description of what the image shows](./images/screenshot.png)
```

Nothing needs a unique name across the whole site — two posts can both have a
`loss-curve.png` — and deleting the post's folder deletes its pictures with it.
A cover works the same way: `cover: ./images/cover.png` in the frontmatter.

Which comes out like this:

![A terracotta temple floodlit in saffron, amber and green against a deep blue night sky](./images/temple.png)

Astro converts it to modern formats, generates the right sizes for different
screens, and sets width and height so the page doesn't jump while it loads.
Images get a hairline border to match the rest of the page.

Always write real alt text. If the image is purely decorative, use `![]()` with
an empty description rather than describing it badly.

## Not supported

Definition lists (`Term` / `: definition`) are not part of GitHub-flavoured
Markdown and render as a plain paragraph. Use a two-column table instead.

Raw `<script>` in a post is stripped. If you need something interactive, ask
for a component — that is what `.mdx` is for.

## Maths

Typeset at build time by KaTeX. Inline maths goes between single dollars:
scaled dot-product attention divides by $\sqrt{d_k}$ to keep the softmax out of
its saturated region.

Display maths goes between double dollars on their own lines:

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V
$$

Multi-line derivations work too, and scroll inside their own box if they are
wider than the column:

$$
\begin{aligned}
\mathrm{MultiHead}(Q,K,V) &= \mathrm{Concat}(\mathrm{head}_1, \dots, \mathrm{head}_h)\,W^{O} \
\mathrm{head}_i &= \mathrm{Attention}(QW_i^{Q},\, KW_i^{K},\, VW_i^{V})
\end{aligned}
$$

No maths library is sent to the browser — the equations are already laid out
in the HTML, so they render with JavaScript switched off.
