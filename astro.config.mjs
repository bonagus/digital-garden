// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkWikiLink from './src/plugins/remark-wiki-link.ts';

// https://astro.build/config
export default defineConfig({
  // Static output — bisa deploy ke shared hosting, GitHub Pages, Cloudflare Pages
  output: 'static',

  // Ganti dengan domain Anda nanti
  site: 'https://bonagus.com',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap(),
  ],

  // Markdown/MDX settings
  markdown: {
    remarkPlugins: [remarkWikiLink],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
