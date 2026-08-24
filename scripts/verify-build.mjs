import { readFile, readdir } from 'node:fs/promises';
import { relative } from 'node:path';

const mode = process.argv[2] ?? 'production';

if (!['preview', 'production'].includes(mode)) {
  throw new Error('Aufruf: node scripts/verify-build.mjs preview|production');
}

const distDirectory = new URL('../dist/', import.meta.url);
const expectedSite = process.env.SITE_URL ?? (mode === 'preview'
  ? 'https://janolefabian.github.io'
  : 'https://m-fabian.de');
const configuredBase = process.env.BASE_PATH ?? (mode === 'preview' ? '/m-fabian-astro/' : '/');
const normalizedBase = configuredBase === '/'
  ? '/'
  : `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`;
const canonicalPrefix = new URL(normalizedBase, expectedSite).href;
const failures = [];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = new URL(entry.name, directory);
    return entry.isDirectory() ? collectFiles(new URL(`${entry.name}/`, directory)) : [path];
  }));

  return files.flat();
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const allFiles = await collectFiles(distDirectory);
const htmlFiles = allFiles.filter((path) => path.pathname.endsWith('.html'));
const outputFiles = new Set(allFiles.map((path) => relative(distDirectory.pathname, path.pathname)));
const indexableTitles = new Map();
const indexableDescriptions = new Map();
const indexableCanonicals = new Map();
assert(htmlFiles.length > 0, 'Keine erzeugten HTML-Dateien gefunden.');

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const fileLabel = relative(distDirectory.pathname, file.pathname);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const redirect = /<meta http-equiv="refresh"/i.test(html);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];

  assert(Boolean(robots), `${fileLabel}: robots-Metatag fehlt.`);
  assert(Boolean(canonical), `${fileLabel}: Canonical fehlt.`);
  if (canonical) {
    assert(canonical.startsWith(canonicalPrefix), `${fileLabel}: unerwarteter Canonical ${canonical}`);
    const pathname = new URL(canonical).pathname;
    assert(pathname === normalizedBase || pathname.endsWith('/'), `${fileLabel}: Canonical ohne abschließenden Slash.`);
  }

  if (mode === 'preview') {
    assert(robots?.includes('noindex'), `${fileLabel}: Vorschauseite ist indexierbar.`);
  }

  if (!redirect) {
    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    assert(h1Count === 1, `${fileLabel}: erwartet genau eine H1, gefunden ${h1Count}.`);
    assert(Boolean(title), `${fileLabel}: Title fehlt.`);
    assert(Boolean(description), `${fileLabel}: Meta-Description fehlt.`);

    for (const image of html.match(/<img\b[^>]*>/gi) ?? []) {
      const alt = image.match(/\salt="([^"]*)"/i)?.[1];
      assert(Boolean(alt?.trim()), `${fileLabel}: Bild ohne aussagekräftigen Alt-Text.`);
    }
  }

  if (!redirect && !robots?.includes('noindex')) {
    for (const [label, value, values] of [
      ['Title', title, indexableTitles],
      ['Meta-Description', description, indexableDescriptions],
      ['Canonical', canonical, indexableCanonicals],
    ]) {
      if (!value) continue;
      const previousFile = values.get(value);
      assert(!previousFile, `${fileLabel}: ${label} ist bereits in ${previousFile} vorhanden.`);
      values.set(value, fileLabel);
    }
  }

  for (const href of [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"[^>]*>/gi)].map((match) => match[1])) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

    const url = new URL(href, canonicalPrefix);
    if (url.origin !== new URL(expectedSite).origin) continue;

    const basePathname = new URL(canonicalPrefix).pathname;
    assert(url.pathname.startsWith(basePathname), `${fileLabel}: interner Link liegt außerhalb des Basis-Pfads: ${href}`);
    if (!url.pathname.startsWith(basePathname)) continue;

    const localPath = decodeURIComponent(url.pathname.slice(basePathname.length));
    const outputPath = localPath === ''
      ? 'index.html'
      : localPath.endsWith('/')
        ? `${localPath}index.html`
        : localPath.split('/').at(-1)?.includes('.')
          ? localPath
          : `${localPath}/index.html`;
    assert(outputFiles.has(outputPath), `${fileLabel}: internes Linkziel fehlt: ${href}`);
  }

  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(`${fileLabel}: ungültiges JSON-LD.`);
    }
  }

  assert(!html.includes('"logo":"'), `${fileLabel}: das nicht mehr aktuelle Logo wird als Organization-Logo ausgezeichnet.`);
}

const robotsText = await readFile(new URL('robots.txt', distDirectory), 'utf8');
const sitemapText = await readFile(new URL('sitemap.xml', distDirectory), 'utf8');
const sitemapLocations = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(new Set(sitemapLocations).size === sitemapLocations.length, 'Die Sitemap enthält doppelte URLs.');
const homeHtml = await readFile(new URL('index.html', distDirectory), 'utf8');
const homeStructuredDataSource = homeHtml.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)?.[1];

assert(Boolean(homeStructuredDataSource), 'Auf der Startseite fehlen strukturierte Daten.');
if (homeStructuredDataSource) {
  const structuredData = JSON.parse(homeStructuredDataSource);
  const graph = structuredData['@graph'] ?? [];
  const person = graph.find((item) => item['@type'] === 'Person');
  const organization = graph.find((item) => item['@type'] === 'Organization' && item['@id']?.endsWith('#organization'));

  assert(Array.isArray(person?.memberOf) && person.memberOf.length === 2, 'DGSv und DGGO fehlen als Person-Mitgliedschaften.');
  assert(!person?.sameAs, 'Nicht abgeglichene Profil-URLs stehen bereits als sameAs im Person-Schema.');
  assert(!organization?.logo, 'Das alte Logo wird im Organization-Schema verwendet.');
}

if (mode === 'preview') {
  assert(!robotsText.includes('Sitemap:'), 'Die Vorschau verweist in robots.txt auf eine Sitemap.');
  assert(!sitemapText.includes('<url>'), 'Die Vorschau-Sitemap enthält indexierbare URLs.');
} else {
  assert(robotsText.includes(`Sitemap: ${new URL('sitemap.xml', canonicalPrefix).href}`), 'Produktions-Sitemap fehlt in robots.txt.');
  assert(sitemapText.includes(`<loc>${canonicalPrefix}</loc>`), 'Die Produktions-Startseite fehlt in der Sitemap.');
  assert(!sitemapText.includes('/agb/'), 'Die ungeprüfte AGB-Seite steht in der Sitemap.');
  assert(!sitemapText.includes('/impressum/'), 'Die ungeprüfte Impressum-/Datenschutzseite steht in der Sitemap.');
  for (const [, location] of sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    assert(new URL(location).pathname.endsWith('/'), `Sitemap-URL ohne abschließenden Slash: ${location}`);
  }
}

const articleHtml = await readFile(new URL('aktuelles/aus-der-krise-fuehren/index.html', distDirectory), 'utf8');
assert(articleHtml.includes('aus-der-krise-fuehren-cover'), 'Der Fachartikel verwendet nicht sein Titelblatt als Social-/Schema-Bild.');
assert(!articleHtml.includes('article:published_time'), 'Der Fachartikel enthält ein nicht freigegebenes Veröffentlichungsdatum.');
assert(!articleHtml.includes('"datePublished"'), 'Das Article-Schema enthält ein nicht freigegebenes Veröffentlichungsdatum.');

const redirectHtml = await readFile(new URL('angebote/burnout-krise/index.html', distDirectory), 'utf8');
assert(redirectHtml.includes('noindex'), 'Die alte Burnout-/Krise-URL ist nicht auf noindex gesetzt.');
assert(redirectHtml.includes(`${normalizedBase}angebote/`), 'Die alte Burnout-/Krise-URL verweist nicht auf die Angebotsübersicht.');

if (failures.length > 0) {
  throw new Error(`Build-Prüfung fehlgeschlagen:\n- ${failures.join('\n- ')}`);
}

console.log(`Build-Prüfung (${mode}) erfolgreich: ${htmlFiles.length} HTML-Dateien geprüft.`);
