import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Shared queries for the content collections.
 *
 * Everything that reads content goes through here so that draft filtering and
 * sort order are defined exactly once. Drafts stay visible while you run
 * `npm run dev`, and are dropped from `npm run build`.
 */

const includeDrafts = import.meta.env.DEV;

export type WorkEntry = CollectionEntry<'work'>;
export type BlogEntry = CollectionEntry<'blog'>;

/** All projects: manual `order` first, then newest year. */
export async function getWork(): Promise<WorkEntry[]> {
  const entries = await getCollection('work', ({ data }) => includeDrafts || !data.draft);
  return entries.sort((a, b) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return b.data.year.localeCompare(a.data.year);
  });
}

/** All posts, newest first. */
export async function getBlogPosts(): Promise<BlogEntry[]> {
  const entries = await getCollection('blog', ({ data }) => includeDrafts || !data.draft);
  return entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** The homepage selection. Falls back to the most recent if none are flagged. */
export async function getFeaturedWork(limit = 3): Promise<WorkEntry[]> {
  const all = await getWork();
  const featured = all.filter((e) => e.data.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

/**
 * Papers rebuilt from the paper, newest first.
 *
 * Kept apart from professional work throughout the site: one shows what you
 * can be trusted with, the other shows what you do when nobody is asking.
 */
export async function getScratchBuilds(): Promise<WorkEntry[]> {
  return (await getWork()).filter((e) => e.data.kind === 'scratch');
}

/**
 * Work done for an employer or client, newest first.
 *
 * Employment now lives in `career` in src/config/site.ts and renders on
 * /experience/ with its bullets set out in full, so this returns nothing
 * unless you deliberately add a `kind: work` Markdown file.
 */
export async function getProfessionalWork(): Promise<WorkEntry[]> {
  return (await getWork()).filter((e) => e.data.kind !== 'scratch');
}

export async function getRecentPosts(limit = 3): Promise<BlogEntry[]> {
  return (await getBlogPosts()).slice(0, limit);
}

/**
 * The ids of posts that exist, for linking a rebuild to its write-up.
 *
 * Matched by name, not by a config field: `src/content/work/bert-from-scratch.md`
 * is written up by `src/content/blog/bert-from-scratch/`. A convention has
 * nothing to keep in sync — rename or delete the post and the link follows by
 * itself, where a `writeup:` field in frontmatter would quietly rot.
 *
 * Callers fall back to `/blog/` when the id is absent. That is not paranoia:
 * `draft: true` removes a post from the production build but not from dev, so
 * a hard-coded `/blog/<id>/` would work in dev and 404 on the live site — the
 * exact class of bug nobody catches before shipping.
 */
export async function getWriteupIds(): Promise<Set<string>> {
  return new Set((await getBlogPosts()).map((post) => post.id));
}

/**
 * The other parts of a post's series, in reading order.
 *
 * Returns [] for a standalone post, so the caller never needs to special-case
 * one. Sorted by `part` rather than by date: the order the author intended is
 * not always the order they were published in.
 */
export async function getSeries(name: string): Promise<BlogEntry[]> {
  const posts = await getBlogPosts();
  return posts
    .filter((e) => e.data.series?.name === name)
    .sort((a, b) => (a.data.series?.part ?? 0) - (b.data.series?.part ?? 0));
}

/**
 * The URL form of a tag. 'Bengali NLP' -> 'bengali-nlp'.
 *
 * Lossy on purpose, and that is fine because nothing ever converts a slug back
 * into a label — `getTagIndex()` carries the original text alongside the slug,
 * so the page prints the tag exactly as it was written in the frontmatter.
 *
 * Accents are stripped via NFD rather than mapped by hand, so a tag written
 * 'Naïve Bayes' resolves to 'naive-bayes' instead of dropping the letter.
 */
export function tagSlug(tag: string): string {
  return tag
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface TagGroup {
  /** The tag exactly as written in frontmatter — what the page prints. */
  label: string;
  /** The URL segment. */
  slug: string;
  /** Every published post carrying it, newest first. */
  posts: BlogEntry[];
}

/**
 * Every blog tag, with its posts. The single source for the tag routes.
 *
 * Two tags that differ only in case or punctuation ('Bengali NLP' vs
 * 'bengali nlp') collapse to one slug, and would otherwise generate the same
 * route twice and fail the build with a duplicate-path error. They are merged
 * here instead, and the first spelling encountered wins the label — posts are
 * newest-first, so that is the most recent spelling, which is the one the
 * author is currently using.
 *
 * Sorted by post count, then alphabetically, so the order is stable across
 * builds rather than depending on which file the glob happened to read first.
 */
export async function getTagIndex(): Promise<TagGroup[]> {
  const posts = await getBlogPosts();
  const groups = new Map<string, TagGroup>();

  for (const post of posts) {
    for (const label of post.data.tags) {
      const slug = tagSlug(label);
      if (!slug) continue; // a tag of only punctuation has no URL to give it
      const group = groups.get(slug) ?? { label, slug, posts: [] };
      // A post tagged 'NLP' and 'nlp' must not appear twice on one page.
      if (!group.posts.includes(post)) group.posts.push(post);
      groups.set(slug, group);
    }
  }

  return [...groups.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.label.localeCompare(b.label)
  );
}

/** Every tag used across the blog, most-used first. */
export async function getBlogTags(): Promise<string[]> {
  const posts = await getBlogPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
}

/** '5 August 2026' — unambiguous, and the same in every locale that matters. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** '2026-08-05' — for <time datetime> and structured data. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** A rough reading time. Honest enough, and better than nothing. */
export function readingTime(body: string | undefined): string {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
