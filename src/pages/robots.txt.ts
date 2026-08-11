import type { APIRoute } from 'astro';

/**
 * Generated rather than static so the sitemap URL always matches whatever
 * `site` is set to in astro.config.mjs — including on preview deployments.
 */
export const GET: APIRoute = ({ site }) => {
  const body = `# ${site?.host ?? 'personal site'}

User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site)}

# A plain-language map of this site for language models:
# ${new URL('llms.txt', site)}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
