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
  // Strict CSP (§12). Astro adds script-src/style-src with per-build hashes;
  // no inline script is unhashed. Delivered as a <meta http-equiv> since
  // GitHub Pages can't set headers — which also means frame-ancestors is
  // not listed here: the spec forbids delivering it via <meta> at all, and
  // every browser logs a console warning and ignores it if you try.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
    },
  },
  // No code blocks in content; disabling Shiki removes its CSP-incompatible
  // inline styles.
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/diagrams'),
    }),
  ]
});