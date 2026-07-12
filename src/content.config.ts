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
 * Projects — showcase project, case study, dokumentasi teknis
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    ...baseFields,
    type: z.literal('project').default('project'),
    status: z.enum(['active', 'completed', 'archived', 'paused']).default('active'),
    techStack: z.array(z.string()).default([]),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
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
  projects,
  experiments,
  pages,
};
