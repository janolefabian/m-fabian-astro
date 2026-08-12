import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import prefixBaseUrls from './src/utils/prefix-base-urls.mjs';

const site = process.env.SITE_URL ?? 'https://www.m-fabian.de';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'never',
  server: {
    port: 4331,
  },
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [[prefixBaseUrls, { base }]],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
