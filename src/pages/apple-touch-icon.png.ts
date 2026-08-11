import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { iconSvg } from '../lib/mark';

/**
 * The icon iOS uses when the site is saved to a home screen.
 *
 * 180px is the largest size Apple asks for and everything else is derived from
 * it by the OS. Rasterised at build time by resvg from the same drawing as the
 * favicon — nothing here is hand-drawn or exported from a design tool.
 *
 * Deliberately the light palette in both themes: iOS composites this on the
 * user's wallpaper and applies its own rounded mask, and has no notion of the
 * site's colour scheme. The accent rule runs to the edges and is clipped by
 * that mask, which is the intended look.
 */
const SIZE = 180;

export const GET: APIRoute = () => {
  const png = new Resvg(iconSvg('light'), {
    fitTo: { mode: 'width', value: SIZE },
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng();

  // No long cache header: unlike the share cards this filename never changes,
  // so a cached copy could not be replaced if the mark were ever redrawn.
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
