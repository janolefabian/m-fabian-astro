import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    navTitle: z.string(),
    seoTitle: z.string(),
    description: z.string().max(180),
    section: z.enum(['home', 'about', 'services', 'news', 'contact', 'legal']).optional(),
    eyebrow: z.string().optional(),
    heroTexts: z.array(z.string()).optional(),
    secondColumn: z.string().optional(),
    notice: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { pages };
