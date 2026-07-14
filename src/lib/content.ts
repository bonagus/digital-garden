import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

// Types
export type NoteEntry = CollectionEntry<'notes'>;
export type EssayEntry = CollectionEntry<'essays'>;
export type BookEntry = CollectionEntry<'books'>;
export type PodcastEntry = CollectionEntry<'podcasts'>;
export type ProjectEntry = CollectionEntry<'projects'>;
export type ExperimentEntry = CollectionEntry<'experiments'>;
export type AnyContentEntry = NoteEntry | EssayEntry | BookEntry | PodcastEntry | ProjectEntry | ExperimentEntry;

/**
 * Filter out draft entries in production
 */
function filterDrafts<T extends { data: { draft?: boolean } }>(entries: T[]): T[] {
  if (import.meta.env.PROD) {
    return entries.filter((entry) => !entry.data.draft);
  }
  return entries;
}

/**
 * Sort entries by startDate (newest first)
 */
function sortByDate<T extends { data: { startDate: string | Date } }>(entries: T[]): T[] {
  return entries.sort((a, b) => {
    const dateA = new Date(a.data.startDate);
    const dateB = new Date(b.data.startDate);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get published notes (no drafts in prod, sorted by date)
 */
export async function getPublishedNotes(): Promise<NoteEntry[]> {
  const entries = await getCollection('notes');
  return sortByDate(filterDrafts(entries));
}

/**
 * Get published essays
 */
export async function getPublishedEssays(): Promise<EssayEntry[]> {
  const entries = await getCollection('essays');
  return sortByDate(filterDrafts(entries));
}

/**
 * Get published books
 */
export async function getPublishedBooks(): Promise<BookEntry[]> {
  const entries = await getCollection('books');
  return sortByDate(filterDrafts(entries));
}

/**
 * Get published podcasts
 */
export async function getPublishedPodcasts(): Promise<PodcastEntry[]> {
  const entries = await getCollection('podcasts');
  return sortByDate(filterDrafts(entries));
}

/**
 * Get published projects
 */
export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const entries = await getCollection('projects');
  return sortByDate(filterDrafts(entries));
}

/**
 * Get published experiments
 */
export async function getPublishedExperiments(): Promise<ExperimentEntry[]> {
  const entries = await getCollection('experiments');
  return sortByDate(filterDrafts(entries));
}

/**
 * Get all published content (all types combined)
 */
export async function getAllPublishedContent(): Promise<AnyContentEntry[]> {
  const [notes, essays, books, podcasts, projects, experiments] = await Promise.all([
    getPublishedNotes(),
    getPublishedEssays(),
    getPublishedBooks(),
    getPublishedPodcasts(),
    getPublishedProjects(),
    getPublishedExperiments(),
  ]);
  return sortByDate([...notes, ...essays, ...books, ...podcasts, ...projects, ...experiments]);
}

/**
 * Get all unique topics across all content
 */
export async function getAllTopics(): Promise<string[]> {
  const allContent = await getAllPublishedContent();
  const topicSet = new Set<string>();
  for (const entry of allContent) {
    for (const topic of entry.data.topics) {
      topicSet.add(topic);
    }
  }
  return Array.from(topicSet).sort();
}

/**
 * Get content filtered by topic
 */
export async function getContentByTopic(topic: string): Promise<AnyContentEntry[]> {
  const allContent = await getAllPublishedContent();
  return allContent.filter((entry) => entry.data.topics.includes(topic));
}

/**
 * Get related content for a given entry based on shared topics
 * Returns up to `limit` entries sorted by relevance (most shared topics first)
 */
export async function getRelatedContent(
  currentId: string,
  currentTopics: string[],
  limit = 4,
): Promise<AnyContentEntry[]> {
  const allContent = await getAllPublishedContent();
  const scored = allContent
    .filter((entry) => entry.id !== currentId)
    .map((entry) => {
      const shared = entry.data.topics.filter((t) => currentTopics.includes(t)).length;
      return { entry, shared };
    })
    .filter((item) => item.shared > 0)
    .sort((a, b) => b.shared - a.shared);
  return scored.slice(0, limit).map((item) => item.entry);
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
