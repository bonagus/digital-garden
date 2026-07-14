import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const [notes, essays, books, podcasts, projects, experiments] = await Promise.all([
    getCollection('notes'),
    getCollection('essays'),
    getCollection('books'),
    getCollection('podcasts'),
    getCollection('projects'),
    getCollection('experiments'),
  ]);

  const allContent = [...notes, ...essays, ...books, ...podcasts, ...projects, ...experiments]
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime());

  return rss({
    title: 'Bonagus — Digital Garden',
    description: 'Personal Digital Garden & Knowledge Portfolio. Catatan, esai, buku, podcast, project, dan eksperimen.',
    site: context.site!,
    items: allContent.map((entry) => ({
      title: entry.data.title,
      pubDate: new Date(entry.data.startDate),
      description: entry.data.description,
      link: `/${entry.id}/`,
    })),
    customData: '<language>id</language>',
  });
}
