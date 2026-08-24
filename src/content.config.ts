import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const optionalDate = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  z.coerce.date().optional(),
);
const optionalString = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  z.string().min(1).optional(),
);

const textBlock = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
});

const serviceCard = z.object({
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  description: z.string().min(1),
});

const homeSections = z.object({
  hero: z.object({
    titleBefore: z.string().min(1),
    titleAccent: z.string().min(1),
    titleAfter: z.string().min(1),
    intro: z.string().min(1),
    primaryLabel: z.string().min(1),
    secondaryLabel: z.string().min(1),
  }),
  working: textBlock,
  services: textBlock.extend({
    linkLabel: z.string().min(1),
    cards: z.object({
      leadership: serviceCard,
      teamwork: serviceCard,
      change: serviceCard,
      moderation: serviceCard,
    }),
  }),
  profile: textBlock.extend({
    text: z.string().min(1),
    linkLabel: z.string().min(1),
  }),
  testimonial: z.object({
    eyebrow: z.string().min(1),
    quote: z.string().min(1),
    attribution: z.string().min(1),
    linkLabel: z.string().min(1),
  }),
  contact: textBlock.extend({
    text: z.string().min(1),
    buttonLabel: z.string().min(1),
  }),
}).optional();

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    navTitle: z.string().min(1),
    seoTitle: z.string().min(1).max(60),
    description: z.string().min(1).max(180),
    section: z.enum(['home', 'about', 'services', 'news', 'contact', 'legal']).optional(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),
    heroTexts: z.array(z.string()).optional(),
    secondColumn: z.string().optional(),
    notice: z.string().optional(),
    draft: z.boolean().default(false),
    noindex: z.boolean().default(false),
    publishedAt: optionalDate,
    updatedAt: optionalDate,
    authors: z.array(z.string().min(1)).optional(),
    socialImage: optionalString,
    socialImageAlt: optionalString,
    homeSections,
    order: z.number().default(0),
  }),
});

export const collections = { pages };
