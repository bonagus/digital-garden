/**
 * generate-links.ts
 *
 * Pre-build script that scans all MDX content files for [[wiki links]],
 * resolves them to actual content slugs, and outputs a link map JSON.
 *
 * Usage: npx tsx scripts/generate-links.ts
 * Output: src/data/links.json
 *
 * The JSON structure:
 * {
 *   "contentMap": { "title-lowercase": { "id": "slug", "title": "Title", "collection": "notes" } },
 *   "outboundLinks": { "slug": ["target-slug", ...] },
 *   "inboundLinks": { "slug": ["source-slug", ...] }
 * }
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'node:fs/promises';

// Content directories to scan
const CONTENT_DIR = path.resolve(import.meta.dirname, '../src/content');
const OUTPUT_FILE = path.resolve(import.meta.dirname, '../src/data/links.json');

// Collections to process
const COLLECTIONS = ['notes', 'essays', 'projects', 'experiments'];

// Wiki link regex: [[Target Title]] or [[Target Title|Display Text]]
const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

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

/**
 * Extract frontmatter from MDX file content
 */
function extractFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result: Record<string, any> = {};

  for (const line of yaml.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Handle arrays (simple single-line format)
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1);
      result[key] = inner.split(',').map((s) => {
        const trimmed = s.trim();
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          return trimmed.slice(1, -1);
        }
        return trimmed;
      }).filter(Boolean);
      continue;
    }

    result[key] = value;
  }

  // Handle multiline arrays (- item format)
  const aliasesMatch = yaml.match(/aliases:\s*\n((?:\s+-\s+.+\n?)*)/);
  if (aliasesMatch) {
    result.aliases = aliasesMatch[1]
      .split('\n')
      .map((line) => line.replace(/^\s+-\s+/, '').trim())
      .filter(Boolean)
      .map((s) => {
        if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
          return s.slice(1, -1);
        }
        return s;
      });
  }

  return result;
}

/**
 * Get all content files and build a lookup map
 */
async function buildContentMap(): Promise<Map<string, ContentItem>> {
  const contentMap = new Map<string, ContentItem>();

  for (const collection of COLLECTIONS) {
    const dir = path.join(CONTENT_DIR, collection);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const frontmatter = extractFrontmatter(content);

      const id = file.replace(/\.(md|mdx)$/, '');
      const title = frontmatter.title || id;
      const aliases: string[] = Array.isArray(frontmatter.aliases) ? frontmatter.aliases : [];

      const item: ContentItem = { id, title, collection, aliases };

      // Map by normalized title
      contentMap.set(title.toLowerCase(), item);

      // Map by id (slug)
      contentMap.set(id.toLowerCase(), item);

      // Map by aliases
      for (const alias of aliases) {
        contentMap.set(alias.toLowerCase(), item);
      }
    }
  }

  return contentMap;
}

/**
 * Scan content for wiki links and build link relationships
 */
async function generateLinks(): Promise<void> {
  const contentMap = await buildContentMap();
  const outboundLinks: Record<string, string[]> = {};
  const inboundLinks: Record<string, string[]> = {};

  for (const collection of COLLECTIONS) {
    const dir = path.join(CONTENT_DIR, collection);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const sourceId = file.replace(/\.(md|mdx)$/, '');

      // Find all wiki links in this file
      const links: string[] = [];
      let match: RegExpExecArray | null;

      // Reset regex
      WIKI_LINK_REGEX.lastIndex = 0;

      while ((match = WIKI_LINK_REGEX.exec(content)) !== null) {
        const target = match[1].trim();
        const resolved = contentMap.get(target.toLowerCase());

        if (resolved && resolved.id !== sourceId) {
          links.push(resolved.id);

          // Add inbound link
          if (!inboundLinks[resolved.id]) {
            inboundLinks[resolved.id] = [];
          }
          if (!inboundLinks[resolved.id].includes(sourceId)) {
            inboundLinks[resolved.id].push(sourceId);
          }
        }
      }

      if (links.length > 0) {
        outboundLinks[sourceId] = [...new Set(links)];
      }
    }
  }

  // Build serializable content map (title -> item)
  const serializedMap: Record<string, ContentItem> = {};
  for (const [key, value] of contentMap.entries()) {
    // Only store by ID to avoid duplicate entries
    serializedMap[key] = value;
  }

  const linkMap: LinkMap = {
    contentMap: serializedMap,
    outboundLinks,
    inboundLinks,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(linkMap, null, 2));

  // Stats
  const totalOutbound = Object.values(outboundLinks).reduce((sum, links) => sum + links.length, 0);
  const totalInbound = Object.values(inboundLinks).reduce((sum, links) => sum + links.length, 0);
  console.log(`✓ Link map generated: ${OUTPUT_FILE}`);
  console.log(`  → ${Object.keys(outboundLinks).length} files with outbound links (${totalOutbound} total)`);
  console.log(`  → ${Object.keys(inboundLinks).length} files with inbound links (${totalInbound} total)`);
}

generateLinks().catch((err) => {
  console.error('Error generating links:', err);
  process.exit(1);
});
