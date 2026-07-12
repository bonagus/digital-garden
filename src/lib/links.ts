/**
 * links.ts — helper functions to read link map data
 */
import linksData from '../data/links.json';

interface ContentItem {
  id: string;
  title: string;
  collection: string;
  aliases: string[];
}

interface LinkMap {
  contentMap: Record<string, ContentItem>;
  outboundLinks: Record<string, string[]>;
  inboundLinks: Record<string, string[]>;
}

const linkMap = linksData as LinkMap;

/**
 * Get backlinks (inbound links) for a given content ID
 */
export function getBacklinks(contentId: string): ContentItem[] {
  const inbound = linkMap.inboundLinks[contentId] || [];
  return inbound
    .map((id) => {
      // Find the item by id in contentMap
      const item = linkMap.contentMap[id.toLowerCase()];
      return item || null;
    })
    .filter((item): item is ContentItem => item !== null);
}

/**
 * Get outbound links for a given content ID
 */
export function getOutboundLinks(contentId: string): ContentItem[] {
  const outbound = linkMap.outboundLinks[contentId] || [];
  return outbound
    .map((id) => {
      const item = linkMap.contentMap[id.toLowerCase()];
      return item || null;
    })
    .filter((item): item is ContentItem => item !== null);
}

/**
 * Check if a content ID has any backlinks
 */
export function hasBacklinks(contentId: string): boolean {
  return (linkMap.inboundLinks[contentId]?.length || 0) > 0;
}
