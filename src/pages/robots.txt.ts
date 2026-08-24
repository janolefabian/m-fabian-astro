import type { APIRoute } from 'astro';
import { withBase } from '../utils/paths';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL('https://m-fabian.de');
  const sitemapUrl = new URL(withBase('/sitemap.xml'), siteUrl);
  const previewNoindex = import.meta.env.PUBLIC_PREVIEW_NOINDEX === 'true';
  const sitemapLine = previewNoindex ? '' : `\nSitemap: ${sitemapUrl.href}\n`;

  return new Response(`User-agent: *\nAllow: /\n${sitemapLine}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
