# Troubleshooting

Failures hit while working on this site, each recorded because the visible
error points away from the actual cause. Each entry leads with the message you
would actually see, so searching this file for the text on your screen finds
the fix.

---

## "Another astro dev server is already running"

```
Another astro dev server is already running.

  URL:  http://localhost:4321
  PID:  17688
```

Nothing is wrong — the server is running and serving the site. Open the URL.

Astro 7 runs the dev server **detached in the background**, so it survives
closing the terminal; in Astro 6 it died with the shell. A second `npm run dev`
therefore refuses to start. Four commands manage it:

```bash
astro dev status         # is one running, on which port and PID
astro dev logs           # tail its output — where errors actually go
astro dev stop           # stop it
npm run dev -- --force   # replace whatever is running
```

`astro dev logs` is the one worth remembering. Because the server is detached,
its output never reaches your terminal, which is why the next entry is so easy
to misdiagnose.

---

## `npm run dev` exits immediately

```
Dev server process exited before becoming ready.
```

That message carries no information. The real error is in `.astro/dev.log`:

```bash
astro dev logs        # or read .astro/dev.log directly
```

The usual cause is a stale font cache. Astro caches the Google Fonts file URLs,
Google rotates them when it re-cuts a subset, and the cached URL starts
returning 404 — which kills the dev server while it is computing fallback
metrics for the font:

```
[CannotFetchFontFile] …/jetbrainsmono/v24/…BYUjKPxDcwgknk-4.woff2
Caused by: Response was not successful, received status code 404
```

Fix:

```bash
rm -rf .astro && npm run dev
```

**`npm run build` is unaffected** — it re-resolves fonts on every run — so a
deploy is never at risk from this. If the build passes and only dev is broken,
this is why.

---

## A Markdown change doesn't show up

Rendered Markdown is cached in `.astro/`, and changing `markdown.*` options in
`astro.config.mjs` does **not** invalidate that cache. The old HTML keeps being
served and the change looks like it silently failed.

```bash
rm -rf .astro && npm run build
```

Do this before concluding anything about a Markdown config change.

---

## `npm install` fails with `EPERM: operation not permitted`

```
EPERM: operation not permitted, unlink
  '…/node_modules/lightningcss-win32-x64-msvc/lightningcss.win32-x64-msvc.node'
```

A running dev server holds a lock on that native binary on Windows. Stop it
first, then install:

```bash
astro dev stop
npm install
```

If the install already failed part-way, `node_modules` may be left incomplete —
run `npm install` again once the lock is released.

---

## `npm run format:check` fails on every file

Line endings. Git stores LF, but on Windows `core.autocrlf` converts to CRLF on
checkout, while Prettier's `endOfLine` defaults to `lf`.

This is already fixed by [`.gitattributes`](.gitattributes), which pins
`text=auto eol=lf` so the working tree is LF on every platform. If you see it
anyway, your clone predates that file — re-clone, or:

```bash
git rm --cached -r .
git reset --hard
```

It matters because `format:check` is the first step of `npm run verify`, which
is also the deploy command.
