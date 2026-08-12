import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
  vite: {
    plugins: [tailwindcss()],
  },
});
