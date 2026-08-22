/**
 * Every piece of personal content on the site, in one place.
 *
 * Drives the masthead, the navigation, the experience and projects pages, the
 * footer, the SEO tags, the sitemap, the JSON-LD and the generated share
 * images. Posts and project entries are the exception — those are one Markdown
 * file each under src/content/.
 *
 * Any string beginning with TODO is a placeholder: `filled()` shows it in dev
 * and strips it from the production build, so the site is deployable at any
 * point. `npm run check:content` lists what is outstanding. A section left
 * empty renders nothing rather than an empty shell.
 */

/* ─────────────────────────────────────────────────────────────────────────
   1 · IDENTITY
   ───────────────────────────────────────────────────────────────────────── */

export const identity = {
  /** Full name. Used in the masthead, <title>, and structured data. */
  name: 'Samyamoy Rakshit',

  /** Short form, for the navigation and footer where the full name won't fit. */
  shortName: 'Samyamoy',

  /**
   * Names the monogram — the tab icon, the home-screen icon and the stamp on
   * the share cards. The page itself always sets the name in full.
   *
   * The letterforms are drawn outlines in src/lib/mark.ts, so changing this
   * renames the mark without redrawing it.
   */
  initials: 'SR',

  /** Sits directly under the name on the homepage. */
  role: 'Data Scientist',

  /** One sentence under the role. */
  tagline:
    'I rebuild published models from the paper, on one laptop, to find out how they actually work.',

  /** City, Country. Shown in the colophon strip. Empty hides it. */
  location: 'Bengaluru, India',

  /** IANA timezone. Drives the live local clock in the colophon. */
  timezone: 'Asia/Kolkata',

  /** Contact email. Rendered obfuscated so scrapers have a harder time. */
  email: 'samyamoyrakshit@gmail.com',

  /** Set to '/resume.pdf' once the file is in public/. Empty hides the link. */
  resumeUrl: '',

  /**
   * The portrait lives at src/assets/portrait.jpg and is imported directly by
   * the hero so Astro can convert, resize and hash it. Replacing that file
   * changes the picture; there is no path to edit here. Only the alt text is
   * configuration.
   */
  portraitAlt: 'Samyamoy Rakshit',
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   2 · AVAILABILITY
   The status dot in the header. `open: false` shows it as closed;
   `show: false` hides it entirely.
   ───────────────────────────────────────────────────────────────────────── */

export const availability = {
  // Off while employed. A site advertising "open to work" when that is not
  // true is a small lie current colleagues can read.
  show: false,
  open: true,
  /** Kept very short — it sits inline in the header. */
  label: 'Open to work',
  labelClosed: 'Not looking right now',
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   3 · THE OPENING STATEMENT
   ───────────────────────────────────────────────────────────────────────── */

export const intro = {
  /** The statement under the name in the hero. Two sentences. */
  short:
    'I rebuild published models from the paper — the transformer, BERT, ViT — tensor by tensor in PyTorch, all three on Bengali data, all three trained end to end on one M1 laptop with 16 GB of RAM. Reading a paper and reimplementing it turn out to be very different kinds of understanding. By day I build forecasting and agentic systems at Sigmoid.',

  /**
   * The long form, one string per paragraph. There is no /about/ route — this
   * feeds /llms.txt, the plain-text summary of the site that assistants read.
   */
  long: [
    'I have been at Sigmoid since I finished my B.Tech in 2024, first as an intern, then as an associate, now as a data scientist. The work is for global CPG, spirits, food-ingredients and food-service clients, and it has moved roughly in the order the field has: price elasticity and sales-driver attribution first, then generative and agentic systems, now demand forecasting at a scale where the engineering matters as much as the model.',
    'The two pieces I would point at: I built the whole feature-engineering pipeline behind a multi-agent product recommendation engine that has been live in a client’s sales process since June 2025, and I replaced a per-series Prophet forecast with one global LightGBM model across 9,200 series — a three-hour run became a three-minute one, and day-one error dropped about 15%.',
    'Outside client work I rebuild published models from the paper: the transformer, BERT, the Vision Transformer. No nn.Transformer, no pre-built HuggingFace model — every component written out by hand and trained on one M1 with 16 GB of RAM. Reimplementing a paper is the fastest way I know to find out which parts of it I only thought I understood.',
    'All three run on Bengali. The BERT is pre-trained on Bengali Wikipedia; the transformer translates English into Bengali; the ViT is trained on 1,935 photographs of the terracotta temples at Bishnupur, ten classes, a dataset that did not exist until I assembled it. That last one is also the most useful failure of the three — trained from scratch it reached 14.9%, barely above guessing, which is precisely what the paper predicts and almost nobody publishes.',
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   4 · LINKS
   Rendered in the order listed.
   ───────────────────────────────────────────────────────────────────────── */

export type SocialLink = {
  /** The link text. Lowercase and short. */
  label: string;
  href: string;
  /** Used for the accessible name: "Samyamoy on GitHub". */
  network: string;
};

export const socials: SocialLink[] = [
  { label: 'github', network: 'GitHub', href: 'https://github.com/SamyamoyRakshit' },
  {
    label: 'linkedin',
    network: 'LinkedIn',
    href: 'https://www.linkedin.com/in/samyamoy-rakshit-ba4520190/',
  },
  { label: 'x', network: 'X', href: 'https://x.com/samyamoy_ai' },
];

/* ─────────────────────────────────────────────────────────────────────────
   5 · TOOLKIT
   Grouped plain lists, not skill bars or percentages — a number against a
   skill is unfalsifiable and everyone reads it that way. Empty groups vanish.
   ───────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────
   5b · THE REBUILD PROJECT

   The three replications are NOT three projects. They are three parts of one
   repository — a reader who sees "BERT", "Transformer" and "ViT" listed as
   peers concludes there were three separate efforts, which both overstates the
   count and understates what is actually impressive: one sustained body of
   work, on one laptop.

   Each part keeps its own Markdown file under src/content/work/, because each
   has its own paper, its own numbers and its own write-up. This is only the
   heading they sit under. Order is set by `order:` in those files and is
   deliberate: BERT leads because it is the strongest result on the site.

   Wording is the approved copy from WEBSITE-CONTEXT.md §3.6.
   ───────────────────────────────────────────────────────────────────────── */

export const scratchProject = {
  name: 'papers-from-scratch',
  tagline: 'SOTA architectures rebuilt in PyTorch',
  /* One sentence each, because two pages carry this and printing the identical
     paragraph on both makes the second page feel like the first one again.

     The homepage prints `summary` alone — the claim, which is the reason to
     keep reading. /projects/ prints both, so arriving there adds something.
     The words are unchanged from the approved copy in WEBSITE-CONTEXT.md §3.6;
     only where they are said has changed. */
  summary:
    'Three papers replicated tensor by tensor on Bengali data — no nn.Transformer, no nn.MultiheadAttention, no pre-built HuggingFace models.',
  detail:
    'Every one trained end to end from random weights on a single Apple M1 with 16 GB of RAM, and measured against published baselines on identical splits.',
  /* NOTE: this repo is PRIVATE as of writing. Make it public before deploying,
     or every visitor who clicks Source gets a 404 — see WEBSITE-CONTEXT.md
     §3.6, which records that it has been checked and is safe to publish. */
  repo: 'https://github.com/samyamoyrakshit/papers-from-scratch',
};

export type ToolkitGroup = {
  heading: string;
  items: string[];
};

// Taken from your CV and then cut down, on the principle in the comment above:
// everything here is something you have shipped with or trained with, so any
// line of it is safe to be interrogated on. Add nothing you have only read
// about.
export const toolkit: ToolkitGroup[] = [
  { heading: 'Languages', items: ['Python', 'SQL'] },
  {
    heading: 'Deep learning',
    items: ['PyTorch', 'Transformers', 'BERT', 'Vision Transformers'],
  },
  {
    heading: 'Generative and agentic',
    items: [
      'Azure OpenAI',
      'Azure ML Prompt Flow',
      'RAG',
      'Multi-agent systems',
      'Model Context Protocol',
      'Ollama',
    ],
  },
  {
    heading: 'Modelling and statistics',
    items: [
      'scikit-learn',
      'LightGBM',
      'Prophet',
      'Mixed-effects models',
      'SARIMAX',
      'Ridge and Lasso',
      'Experiment design',
    ],
  },
  { heading: 'Data and cloud', items: ['Snowflake', 'Microsoft Fabric', 'Azure ML'] },
];

/* ─────────────────────────────────────────────────────────────────────────
   6 · THE RECORD — education, roles, milestones
   Newest first. `end: null` means "present".
   Leave the array empty to hide the section entirely.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * One piece of work inside a role.
 *
 * The bullets are the point. A job title tells a reader nothing they cannot
 * guess; "9,200 series, three hours to three minutes" tells them everything.
 * These are set out in full on /experience/ — nobody should have to click to
 * find out what you actually did.
 */
export type RoleProject = {
  /** What the piece of work was called. */
  name: string;
  /** The client, described but not named. Kept anonymous — this site is public. */
  client?: string;
  /** e.g. 'Apr 2026 – Present'. Displayed verbatim. */
  period?: string;
  /** One or two sentences of context, before the bullets. */
  summary?: string;
  /** The actual lines. Straight from your CV. */
  bullets: string[];
  /** Shown as tags under the bullets. */
  tech?: string[];
};

export type CareerEntry = {
  /** e.g. '2024' or '2024-06'. Any string — it is displayed verbatim. */
  start: string;
  /** null = ongoing. */
  end: string | null;
  /** Job title, degree, or what the milestone was. */
  title: string;
  /** Company, institution, or context. */
  org: string;
  /** Optional single line. What you actually did or built. */
  note?: string;
  /** Optional link to the org. */
  href?: string;
  /** 'Full time', 'Internship', … Shown as a small tag beside the title. */
  type?: string;
  /** City, and whether it is on-site or hybrid. */
  location?: string;
  /** The work itself, set out in full on /experience/. */
  projects?: RoleProject[];
  /** Anything awarded for this role. */
  award?: string;
  /** Proof of the award, if it can be linked. An award nobody can check is
      an assertion; one with a certificate behind it is evidence. */
  awardHref?: string;
};

/**
 * A stable fragment id for a role.
 *
 * Defined once, here, because two pages depend on it agreeing: /experience/
 * stamps it onto the role, and the homepage links to it. Derive it in either
 * place separately and the two drift the first time a title is edited.
 *
 * Title AND org, because a title on its own collides the moment the same job
 * title appears at two employers.
 */
export const roleId = (role: CareerEntry) =>
  `${role.title}-${role.org}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const career: CareerEntry[] = [
  {
    start: 'Jan 2026',
    end: null,
    title: 'Data Scientist',
    org: 'Sigmoid',
    href: 'https://www.sigmoid.com/',
    type: 'Full time',
    location: 'Bengaluru, India · Hybrid',
    note: 'Re-engineered daily demand forecasting across 9,200 machine × product series — full run from ~3 hours to ~3 minutes. Plus an MCP proof of concept driven from three model backends.',
    projects: [
      {
        name: 'Demand forecasting — vending and food service',
        client: 'Global food-service operator',
        period: 'Apr 2026 – Present',
        summary:
          'Daily demand forecasting across machine × product series, spanning smooth, intermittent, erratic and lumpy demand classes.',
        bullets: [
          'Replaced per-series Prophet with a single global LightGBM model across 9,200 series and 3.8M rows — full run from ~3 hours to ~3 minutes (~60×), next-day forecast error down ~15%.',
          'Settled the formulation over 27 controlled experiments: a log1p target with smearing beat Tweedie hurdle staging and the M5-winning DRFAM architecture.',
          'Cut the feature set from 25 to 15 with no accuracy loss, showing 11 weather variables added no signal to vending demand.',
          'Took end-to-end ownership of exploration, EDA, preprocessing and feature engineering — now extending them to a broader vending and market dataset.',
          'Extended the conversational layer of an LLM-driven canteen menu generator (GPT-4.1) that optimises menus against budget and dietary targets.',
        ],
        tech: ['LightGBM', 'Prophet', 'Snowflake', 'Python', 'GPT-4.1'],
      },
      {
        name: 'Model Context Protocol proof of concept',
        client: 'Internal capability build, taken to a client showcase',
        period: 'Jan – Mar 2026',
        bullets: [
          'Designed and delivered an end-to-end MCP proof of concept — local MCP servers on the Python MCP SDK, exposing product-catalogue and live-data tools.',
          'Drove the same servers from three model backends — Claude Desktop, Gemini 2.5 Flash, and Llama 3.1 running locally via Ollama — demonstrating a vendor-agnostic agentic architecture.',
          'Authored the technical documentation taken to management review, covering MCP architecture, transport layers and server/client implementation.',
        ],
        tech: ['Python MCP SDK', 'Claude', 'Gemini 2.5 Flash', 'Llama 3.1', 'Ollama'],
      },
    ],
  },
  {
    start: 'Dec 2024',
    end: 'Dec 2025',
    title: 'Associate Data Scientist',
    org: 'Sigmoid',
    href: 'https://www.sigmoid.com/',
    type: 'Full time',
    location: 'Bengaluru, India · On-site',
    note: 'Built the feature-engineering pipeline behind a four-agent RAG recommendation engine, and worked on one of those agents — live since June 2025, ~80% accuracy in its core categories. Earlier, price elasticity and promo baselines for a global CPG manufacturer.',
    award: 'Marathon Mastery Award, Sigmoid (Dec 2025) — for the recommendation engine.',
    /* Served from this domain, not Google Drive. A Drive URL is a third-party
       dependency that dies silently if the sharing setting is ever changed,
       and it puts a Google sign-in banner in front of the reader. The file is
       public/marathon-mastery-award.pdf; Base.astro opens same-origin
       documents in a new tab. */
    awardHref: '/marathon-mastery-award.pdf',
    projects: [
      {
        name: 'Generative and agentic AI — product recommendation engine',
        client: 'Global B2B chocolate and cocoa manufacturer',
        period: 'Apr – Dec 2025',
        summary:
          'Multi-agent system embedded in Salesforce: reads a customer brief — emails, opportunity notes, attached technical spec sheets — and returns ranked recommendations from a 13,000-SKU catalogue, replacing rounds of manual back-and-forth between sales and R&D. Live since June 2025.',
        bullets: [
          'Worked on the summarization agent in a Retrieval-Augmented Generation (RAG) pipeline, turning unstructured customer briefs into structured product requirements — Azure OpenAI GPT-4o, Azure ML Prompt Flow.',
          'Built the Microsoft Fabric feature-engineering pipeline end to end — all 15 notebooks, turning raw product data into the golden tables the agents query and the embeddings behind retrieval.',
          'Partnered with R&D and regional commercial teams, working through their documentation, to establish which data sources, columns and SKU combinations drive correct recommendations.',
          'Engine reached ~80% recommendation accuracy in its core chocolate and cocoa powder categories, with recommendations adopted into live sales opportunities across four regions.',
        ],
        tech: ['Azure OpenAI GPT-4o', 'Azure ML Prompt Flow', 'Microsoft Fabric', 'RAG'],
      },
      {
        name: 'Revenue Growth Management analytics',
        client: 'Global health and hygiene CPG manufacturer',
        period: 'Jan – Mar 2025',
        summary:
          'Trained on the econometrics and purchase-structure workbenches behind an enterprise pricing and promotion platform — how much volume a price move costs, and which products absorb it.',
        bullets: [
          'Ran a hierarchical mixed-effects elasticity and promo-baseline pipeline end-to-end on ~1M weekly sales records, 2,400 products and 21 retailers.',
          'Reconciled coefficients against a reference run using Welch t-tests and chi-square checks, confirming the pipeline reproduced signed-off results.',
          'Traced how retailer-level holiday controls keep seasonality out of the price coefficient — the difference between a usable elasticity and a misleading one.',
          'Worked through purchase-structure trees and volume transfer matrices: how attribute hierarchies become SKU-level switching and category walk rates.',
        ],
        tech: ['Mixed-effects models', 'Python', 'SQL'],
      },
    ],
  },
  {
    start: 'Aug 2024',
    end: 'Dec 2024',
    title: 'Data Science Intern',
    org: 'Sigmoid',
    href: 'https://www.sigmoid.com/',
    type: 'Internship',
    location: 'Bengaluru, India · On-site',
    note: 'Measured which levers — price, promo, media, retail execution — actually move sell-through for a global spirits manufacturer, so spend could be aimed where it pays.',
    projects: [
      {
        name: 'Sales-driver attribution',
        client: 'Global spirits manufacturer',
        summary:
          'Assigned to an attribution build isolating how pricing, promotions, media spend and retail execution move retail sell-through across ~600 products and 50 US states.',
        bullets: [
          'Fused a dozen internal and external sources — pricing, promo, media, retail execution, weather, GDP, unemployment — into one product × state × month panel, resolving quarterly/monthly frequency mismatches along the way.',
          'Applied VIF, variance thresholding and backward elimination to separate overlapping price/promo/media signals, so spend impact was not misattributed across correlated levers.',
          'Worked with constrained Ridge/Lasso and sign-constrained SARIMAX models, decomposing volume change into per-driver contributions — the interpretable, commercially-coherent output format the client’s team needed to act on it.',
        ],
        tech: ['SARIMAX', 'Ridge and Lasso', 'Python'],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   6b · EDUCATION
   Shown under the record on /experience/. Newest first.
   ───────────────────────────────────────────────────────────────────────── */

export type EducationEntry = {
  period: string;
  qualification: string;
  institution: string;
  href?: string;
  /** Grade, affiliation, anything worth one line. */
  note?: string;
};

export const education: EducationEntry[] = [
  {
    period: 'Nov 2020 – Jul 2024',
    qualification: 'B.Tech, Computer Science and Engineering (Data Science)',
    institution: 'Haldia Institute of Technology',
    href: 'https://hithaldia.ac.in/',
    note: 'CGPA 9.05. Affiliated to Maulana Abul Kalam Azad University of Technology, West Bengal.',
  },
  {
    period: '2020',
    qualification: 'Higher Secondary (WBCHSE), Science — 94.4%',
    institution: 'Jhantipahari High School',
  },
  {
    period: '2018',
    qualification: 'Secondary (WBBSE) — 90.4%',
    institution: 'Jhantipahari High School',
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   7 · NAVIGATION
   Routes are only shown if they have content. `/blog` hides itself when
   there are no posts, `/work` when there are no projects.
   ───────────────────────────────────────────────────────────────────────── */

export const nav = [
  { label: 'Experience', href: '/experience/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Blog', href: '/blog/' },
  /* The Bengali section. Labelled in Latin — `bn` is the language's own ISO
     639-1 code — because every nav link is `.label`, which letter-spaces its
     text 0.18em, and Bengali must never be letter-spaced. See the note at the
     top of src/pages/bn/index.astro. */
  { label: 'BN', href: '/bn/' },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   8 · SEO & SHARING
   ───────────────────────────────────────────────────────────────────────── */

export const seo = {
  /**
   * Appended to every page title: "About · Samyamoy Rakshit".
   * The homepage uses `homeTitle` instead.
   */
  titleSuffix: identity.name,

  /**
   * The homepage <title>, and the title used on social cards.
   *
   * The role is only appended once it is real. Titles and meta tags are the
   * one place a placeholder must never appear even in development, because
   * they are what gets indexed and shared — so this checks directly rather
   * than going through `filled()`, which deliberately keeps placeholders
   * visible during `npm run dev`.
   */
  homeTitle: identity.role.startsWith('TODO')
    ? identity.name
    : `${identity.name} — ${identity.role}`,

  /**
   * The fallback meta description, used on pages that don't set their own.
   * 150–160 characters is the sweet spot.
   */
  description:
    'Samyamoy Rakshit rebuilds published ML models from the paper on one laptop — the transformer, BERT, ViT — and writes up what broke. Data scientist at Sigmoid Analytics.',

  /** Shown in the RSS feed and structured data. */
  language: 'en',
  locale: 'en_US',

  /**
   * Optional. Only used to verify the site with a search console — leave ''
   * unless you have actually set one up.
   */
  googleSiteVerification: '',
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   9 · SECTION SWITCHES
   Turn parts of the site on and off without deleting any code.
   ───────────────────────────────────────────────────────────────────────── */

export const features = {
  /** The /blog section and its RSS feed. */
  blog: true,
  /** The /work index and project case studies. */
  work: true,
  /** The live local-time readout in the colophon. */
  localClock: true,
  /** The light/dark toggle. Off = always follow the operating system. */
  themeToggle: true,
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   10 · EPIGRAPH
   The strapline under the masthead on /bn/. A line you stand behind, set
   in your own script — which is the one thing on this site that could not
   have been generated for somebody else.

   Leave `lines` empty to remove the band entirely; like every other block
   here, an empty one renders nothing rather than an empty shell.
   ───────────────────────────────────────────────────────────────────────── */

export const epigraph = {
  /**
   * BCP-47 tag for the verse. It is not decoration: it tells the browser
   * which script to shape and which font to reach for, and it tells a screen
   * reader to switch voices instead of reading Bengali in an English one.
   */
  lang: 'bn',

  /**
   * One array entry per line of verse. Set as written, including the older
   * spelling বাঙ্গালী — this is Gurusaday Dutt's own orthography, not a typo
   * to be modernised.
   *
   * The stanza closes on ॥ (U+0965), the single double-danda codepoint, not on
   * two consecutive ।. Same mark, correctly encoded: the font draws ॥ as one
   * designed pair, whereas two separate dandas each carry their own
   * sidebearings and set as হ’ । । with gaps you can drive through.
   */
  lines: ['বিশ্বমানব হবি যদি', 'শাশ্বত বাঙ্গালী হ’॥'],

  /** Who said it. In Bengali only — see the note in Epigraph.astro. */
  author: 'গুরুসদয় দত্ত',
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   11 · FOOTER
   ───────────────────────────────────────────────────────────────────────── */

export const footer = {
  /**
   * The invitation above the contact links.
   *
   * It names what a reader might have — a question, a correction, something to
   * add — rather than what they should think. This footer sits at the end of
   * every post, which is where a stranger arriving from a shared link lands,
   * and any opening conditioned on having read the work ("if any of this was
   * useful") asks them for a verdict they do not have yet.
   */
  callToAction:
    'If you have a question, a correction, or something to add, I would genuinely like to hear it.',
  /* There is no `colophon` line here any more. It named the three typefaces
     and the framework, which is information about how the site was made rather
     than about the person it is for — and "Built with X" is on every generated
     portfolio there is. The slot now prints the date the site last changed,
     computed in src/lib/updated.ts, so there is nothing to keep current by
     hand. */
  /** Set false to remove the "source on GitHub" link in the footer. */
  showSourceLink: false,
  sourceUrl: 'TODO: https://github.com/yourusername/yourrepo',
} as const;

/* ═════════════════════════════════════════════════════════════════════════
   Derived values and helpers. Everything below is computed from the above.
   ═════════════════════════════════════════════════════════════════════════ */

/** The canonical origin, set once in astro.config.mjs via `site`. */
export const SITE_URL: string = import.meta.env.SITE ?? 'http://localhost:4321';

/** True if a value is still an unfilled placeholder. */
export const isPlaceholder = (value: unknown): boolean =>
  typeof value === 'string' && value.trimStart().startsWith('TODO');

/**
 * Returns the value only if it has actually been filled in.
 * Components use this so placeholders never leak into the rendered page in
 * production — an unfilled field renders as nothing rather than as "TODO:".
 */
export const filled = (value: string | undefined | null): string | undefined => {
  if (!value) return undefined;
  if (isPlaceholder(value)) return import.meta.env.DEV ? value : undefined;
  return value;
};

/** Drops placeholder entries from a list of strings. */
export const filledList = (values: readonly string[]): string[] =>
  values.filter((v) => (import.meta.env.DEV ? true : !isPlaceholder(v)));

/** Links that actually point somewhere. */
export const activeSocials = (): SocialLink[] =>
  socials.filter((s) => import.meta.env.DEV || !isPlaceholder(s.href));

export const site = {
  identity,
  availability,
  intro,
  socials,
  toolkit,
  career,
  education,
  nav,
  seo,
  features,
  epigraph,
  footer,
  url: SITE_URL,
} as const;

export default site;
