import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import prefixBaseUrls from './src/utils/prefix-base-urls.mjs';

const site = process.env.SITE_URL ?? 'https://m-fabian.de';
const configuredBase = process.env.BASE_PATH ?? '/';
const base = configuredBase === '/'
  ? '/'
  : `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`;
const siteUrl = new URL(site);
const isGitHubPreview = siteUrl.hostname.endsWith('.github.io');
const previewNoindex = process.env.PUBLIC_PREVIEW_NOINDEX === 'true';
const burnoutRedirectTarget = base === '/' ? '/angebote/' : `${base}angebote/`;

// Fail closed: the public repository preview must never become indexable by
// accident. The production domain, in turn, must not be built below a subpath.
if (isGitHubPreview && !previewNoindex) {
  throw new Error('GitHub-Pages-Vorschauen müssen mit PUBLIC_PREVIEW_NOINDEX=true gebaut werden.');
}

if (siteUrl.hostname === 'm-fabian.de' && base !== '/') {
  throw new Error('Die Produktionsdomain m-fabian.de muss mit BASE_PATH=/ gebaut werden.');
}

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/angebote/burnout-krise': burnoutRedirectTarget,
  },
  server: {
    port: 4331,
  },
  markdown: {
    processor: unified({
      rehypePlugins: [[prefixBaseUrls, { base }]],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
