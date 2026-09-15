# ComTech GmbH — website

Marketing site for ComTech GmbH, a Swiss tokenisation technology company. Built
with [Astro](https://astro.build) + MDX, deployed to GitHub Pages.

Full design and content rules live in [`CLAUDE.md`](./CLAUDE.md) — read that
before changing anything here. The short version: ComTech supplies
tokenisation infrastructure and is never the subject of an asset verb
(issues/holds/custodies/trades/redeems); the diagram system is the site's
primary content; unresolved facts are marked `{{TK: ...}}` rather than guessed.

## Commands

```
npm run dev          # local dev server
npm run build         # production build — fails if any {{TK: survives
npm run build:preview # build without the TK gate (used for local preview/CI while facts are outstanding)
npm run check:tk      # list unresolved {{TK: placeholders
npm run lint:prose    # Vale + frontmatter scan for the §9 copy rules
npm run test:a11y     # Playwright + axe against every route
npm run lhci          # Lighthouse budgets
```

## Structure

- `src/content/pages/` — MDX for every standard page (home, technology,
  solutions, developers, company/*), rendered via `src/pages/[...slug].astro`.
- `src/content/capabilities/` — MDX for `/platform` and `/precious-metals`,
  the two pages with a `StageRail` and a full lifecycle diagram.
- `src/content/pillars/` — the Platform/Technology/Precious Metals comparison
  data used by `PillarComparison.astro`.
- `src/components/diagrams/` — the diagram system: one primitive (`Node`) in
  five arrangements (`Chain`, `Stack`, `Hub`, `Sequence`, `Progression`). All
  eight diagrams from CLAUDE.md §5 render together at `/diagrams` (excluded
  from the sitemap — an internal review page, not a site page).
- `styles/ComTech/` — the Vale style implementing the §9 copy rules.

## Deploy

Push to `main` — `.github/workflows/deploy.yml` builds, runs a11y (blocking)
and Lighthouse (non-blocking while facts are outstanding), and publishes to
GitHub Pages.
