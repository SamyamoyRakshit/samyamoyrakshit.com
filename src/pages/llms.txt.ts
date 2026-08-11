import type { APIRoute } from 'astro';
import { identity, intro, seo, activeSocials, filled, filledList } from '../config/site';
import { getWork, getBlogPosts, isoDate } from '../lib/content';

/**
 * /llms.txt — a plain-Markdown map of the site for language models.
 *
 * Increasingly, someone asking an assistant "who is Samyamoy Rakshit and what
 * has he built" is how this site actually gets read. This gives that assistant
 * the facts in a form it can't misread, instead of leaving it to infer them
 * from styled HTML. Costs nothing, generated from the same source as the pages.
 *
 * Spec: https://llmstxt.org
 */
export const GET: APIRoute = async ({ site }) => {
  const [work, posts] = await Promise.all([getWork(), getBlogPosts()]);

  const url = (path: string) => new URL(path, site).toString();
  const role = filled(identity.role);
  const location = filled(identity.location);
  const summary = filled(intro.short) ?? filled(seo.description);

  const lines: string[] = [`# ${identity.name}`, ''];

  if (role || location) {
    lines.push(`> ${[role, location].filter(Boolean).join(' · ')}`, '');
  }

  if (summary) lines.push(summary, '');

  const about = filledList(intro.long);
  if (about.length > 0) {
    lines.push('## About', '', ...about.flatMap((p) => [p, '']));
  }

  if (work.length > 0) {
    lines.push('## Work', '');
    for (const entry of work) {
      const bits = [entry.data.summary];
      if (entry.data.role) bits.push(`Role: ${entry.data.role}.`);
      if (entry.data.stack.length)
        bits.push(`Built with ${entry.data.stack.join(', ')}.`);
      lines.push(
        // Anchored on the index: there are no per-project pages, each rebuild
        // is a box on /projects/.
        `- [${entry.data.title}](${url(`/projects/#${entry.id}`)}) (${entry.data.year}): ${bits.join(' ')}`
      );
    }
    lines.push('');
  }

  if (posts.length > 0) {
    lines.push('## Blog', '');
    for (const entry of posts) {
      lines.push(
        `- [${entry.data.title}](${url(`/blog/${entry.id}/`)}) (${isoDate(entry.data.pubDate)}): ${entry.data.description}`
      );
    }
    lines.push('');
  }

  const socials = activeSocials();
  const email = filled(identity.email);
  if (socials.length > 0 || email) {
    lines.push('## Elsewhere', '');
    if (email) lines.push(`- Email: ${email}`);
    for (const social of socials) lines.push(`- ${social.network}: ${social.href}`);
    lines.push('');
  }

  lines.push(
    '## Optional',
    '',
    `- [RSS feed](${url('/rss.xml')})`,
    `- [Sitemap](${url('/sitemap-index.xml')})`,
    ''
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
