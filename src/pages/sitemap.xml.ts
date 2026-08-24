import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../utils/paths';

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ?? new URL('https://m-fabian.de');
  const previewNoindex = import.meta.env.PUBLIC_PREVIEW_NOINDEX === 'true';
  const pages = previewNoindex
    ? []
    : await getCollection('pages', ({ data }) => !data.draft && !data.noindex);
  const urls = pages
    .map((entry) => {
      const path = entry.id === 'home' ? '/' : `/${entry.id}`;
      const lastModified = entry.data.updatedAt ?? entry.data.publishedAt;

      return {
        location: new URL(withBase(path), siteUrl).href,
        lastModified: lastModified?.toISOString().slice(0, 10),
      };
    })
    .sort((a, b) => a.location.localeCompare(b.location));
  const entries = urls.map(({ location, lastModified }) => [
    '  <url>',
    `    <loc>${escapeXml(location)}</loc>`,
    lastModified ? `    <lastmod>${lastModified}</lastmod>` : undefined,
    '  </url>',
  ].filter(Boolean).join('\n')).join('\n');
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
