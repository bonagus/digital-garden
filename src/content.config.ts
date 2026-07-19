import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Shared schema fields yang dipakai di semua content types
 */
const baseFields = {
  title: z.string(),
  description: z.string(),
  startDate: z.string().or(z.date()),
  updated: z.string().or(z.date()).optional(),
  topics: z.array(z.string()).default([]),
  growthStage: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
  draft: z.boolean().default(false),
  aliases: z.array(z.string()).default([]),
};

/**
 * Notes — catatan pendek, learning notes, ide mentah
 */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    ...baseFields,
    type: z.literal('note').default('note'),
    cover: z.string().optional(),
  }),
});

/**
 * Essays — tulisan panjang, opini, riset
 */
const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: z.object({
    ...baseFields,
    type: z.literal('essay').default('essay'),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

/**
 * Books — review buku, catatan bacaan, book notes
 */
const books = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/books' }),
  schema: z.object({
    ...baseFields,
    type: z.literal('book').default('book'),
    author: z.string(),
    cover: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    year: z.number().optional(),
    pages: z.number().optional(),
    status: z.enum(['reading', 'finished', 'abandoned']).default('finished'),
    sourceUrl: z.string().url().optional(),
  }),
});

/**
 * Podcasts — audiobook notes, podcast catatan, media audio
 */
const podcasts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/podcasts' }),
  schema: z.object({
    ...baseFields,
    type: z.literal('podcast').default('podcast'),
    author: z.string(),
    cover: z.string().optional(),
    duration: z.string().optional(),
    audioUrl: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    episode: z.string().optional(),
    series: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

/**
 * Projects — showcase project, case study, dokumentasi teknis
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    ...baseFields,
    type: z.literal('project').default('project'),
    status: z.enum(['active', 'completed', 'archived', 'paused']).default('active'),
    featured: z.boolean().default(false),
    techStack: z.array(z.string()).default([]),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    cover: z.string().optional(),
  }),
});

/**
 * Experiments — eksplorasi sementara, proof-of-concept
 */
const experiments = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experiments' }),
  schema: z.object({
    ...baseFields,
    type: z.literal('experiment').default('experiment'),
    status: z.enum(['exploring', 'concluded', 'abandoned']).default('exploring'),
    cover: z.string().optional(),
  }),
});

/**
 * Timeline — update terkini bergaya "now page", berdiri sendiri tapi bagian dari garden
 */
const timeline = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/timeline' }),
  schema: z.object({
    ...baseFields,
    type: z.literal('timeline').default('timeline'),
    growthStage: z.enum(['seedling', 'budding', 'evergreen']).default('evergreen'),
    category: z.enum(['now', 'milestone', 'update', 'life']).default('update'),
  }),
});

/**
 * Pages — halaman statis (about, contact, dsb via MDX jika mau)
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updated: z.string().or(z.date()).optional(),
  }),
});

export const collections = {
  notes,
  essays,
  books,
  podcasts,
  projects,
  experiments,
  timeline,
  pages,
};
