// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import remarkWikiLink from './src/plugins/remark-wiki-link.ts';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  site: 'https://bonagus.my.id',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap(),
    react(),
    keystatic(),
  ],

  markdown: {
    remarkPlugins: [remarkWikiLink],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
