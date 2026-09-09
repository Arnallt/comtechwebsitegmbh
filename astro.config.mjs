// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://arnallt.github.io/comtechwebsitegmbh/
// Swap to a custom domain later by setting site to that domain, base to '/',
// and adding a public/CNAME file.
// https://astro.build/config
export default defineConfig({
  site: 'https://arnallt.github.io',
  base: '/comtechwebsitegmbh/',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/diagrams'),
    }),
  ]
});