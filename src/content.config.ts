import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ownerEnum = z.enum(['comtech', 'third-party', 'emphasis']).default('third-party');

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lead: z.string().optional(),
  }),
});

// Capability pages (/platform, /precious-metals, later /technology/*). All
// prose lives here, never in components (CLAUDE.md §13.3). TK markers go in
// these strings, never in template bodies, so `{{` is never parsed as JSX.
const capabilities = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/capabilities' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    lead: z.string(),
    intro: z.string(),
    diagram: z.object({
      ariaLabel: z.string(),
      nodes: z.array(z.object({ label: z.string(), owner: ownerEnum })),
    }),
    stages: z.array(z.object({ heading: z.string(), body: z.string() })),
    pillars: z.boolean().default(false),
    inProduction: z.array(z.string()),
    roadmap: z.array(z.string()),
    scope: z.object({
      performs: z.string(),
      instructs: z.string(),
      excludes: z.string(),
    }),
    cta: z.object({ label: z.string(), href: z.string() }),
  }),
});

const pillars = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pillars' }),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    summary: z.string(),
    operator: z.string(),
  }),
});

export const collections = { pages, capabilities, pillars };
