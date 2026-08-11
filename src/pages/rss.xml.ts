import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { identity, seo, isPlaceholder } from '../config/site';
import { getBlogPosts } from '../lib/content';

export const GET: APIRoute = async (context) => {
  const posts = await getBlogPosts();

  return rss({
    title: `${identity.name} — Blog`,
    description: isPlaceholder(seo.description)
      ? `Posts by ${identity.name}.`
      : seo.description,
    site: context.site ?? 'https://example.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>${seo.language}</language>`,
  });
};
