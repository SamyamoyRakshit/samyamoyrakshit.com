# Getting this online

The site builds to plain static files, so every option below is **free** and
none of them require buying a domain first. Pick one; you can switch later
without changing any code.

---

## Step 0 — put the code on GitHub

Needed for every option except the drag-and-drop one.

The repository is already initialised locally with a `main` branch. Create an
empty repo on GitHub — **do not** let it add a README or `.gitignore` — then:

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Public or private both work. Vercel, Netlify and Cloudflare can all read a
private repo.

---

## Step 1 — pick a host

### Vercel · fastest, recommended to start

1. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub.
2. Import the repository. It detects Astro; **change nothing**.
3. Deploy.

You get `https://<project-name>.vercel.app`. `vercel.json` in this repo already
sets the caching and security headers. Every push to `main` redeploys, and
pull requests get their own preview URLs.

### Cloudflare Pages · best performance, free analytics

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Build command `npm run verify`, output directory `dist`.
3. Deploy.

You get `https://<project>.pages.dev`. `public/_headers` is already configured.
Turn on Web Analytics in the dashboard for privacy-friendly stats with no
script to add and no cookie banner.

### Netlify · simplest without git

Build locally, then drag the `dist` folder onto
[app.netlify.com/drop](https://app.netlify.com/drop):

```bash
npm run build
```

You get a random `*.netlify.app` URL immediately. `public/_headers` applies
here too. For automatic deploys, connect the GitHub repo instead — build
command `npm run verify`, publish directory `dist`.

### GitHub Pages

Works, but needs a workflow file and is the fiddliest of the four. Only worth it
if you specifically want everything on GitHub. Ask and I'll add the workflow.

---

## Step 2 — set the real URL

**This matters.** `SITE_URL` near the top of `astro.config.mjs` is currently:

```js
const SITE_URL = process.env.SITE_URL ?? 'https://samyamoyrakshit.com';
```

It is the single source of truth for canonical tags, the sitemap, RSS, and the
absolute URLs in your social share images. Until it matches where the site
actually lives, search engines are told the canonical copy is somewhere else.

Change that one string to your real URL, commit, push. Nothing else needs
editing.

If you'd rather not hard-code it, set a `SITE_URL` environment variable in your
host's dashboard instead — the config reads it first.

---

## Step 3 (later) — a real domain

You do not need one to be online, and a `.vercel.app` URL is perfectly
respectable. When you do want one:

- `.com` is the safe default; `.dev` and `.me` are common for personal sites.
  Expect roughly ₹900–1,500 / $12–18 per year for a `.com`, more for `.dev`.
- Buy from a registrar that sells at cost and doesn't upsell — Cloudflare
  Registrar and Porkbun are the usual recommendations. Avoid registrars whose
  first-year price is a fraction of the renewal price.
- Add it in your host's dashboard, follow their DNS instructions, wait for the
  certificate to issue (minutes, usually).
- Then update `SITE_URL` as in step 2, and add the domain to Google Search
  Console.

---

## Before each deploy

```bash
npm run verify
```

Contrast audit, type check, build, 14 checks against the built output, then the
placeholder report. If it passes, push.

## Checking it worked

- `https://your-site/sitemap-index.xml` lists your pages
- `https://your-site/rss.xml` has your posts
- `https://your-site/llms.txt` reads correctly
- `https://your-site/og/default.png` shows the share card
- Paste the URL into [opengraph.dev](https://opengraph.dev) to preview how it
  looks when shared
- Run Lighthouse in Chrome DevTools — this build should score at or near 100
  across the board
