import type { APIRoute } from 'astro';
import { iconSvg } from '../lib/mark';

/**
 * The tab icon.
 *
 * Generated rather than kept in public/ so it cannot drift from the touch icon
 * and the share cards — all three are drawn from src/lib/mark.ts.
 *
 * One file for both themes: the palettes are switched inside the SVG with
 * `prefers-color-scheme`, which browsers honour in favicons. A dark tab strip
 * gets the dark paper rather than a bright square punched into it.
 */
export const GET: APIRoute = () =>
  new Response(iconSvg('auto'), {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
