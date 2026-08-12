import type { APIRoute } from 'astro';
import { withBase } from '../utils/paths';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL('https://www.m-fabian.de');
  const sitemapUrl = new URL(withBase('/sitemap-index.xml'), siteUrl);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
