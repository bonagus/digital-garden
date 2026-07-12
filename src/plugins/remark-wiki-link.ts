/**
 * remark-wiki-link.ts
 *
 * Remark plugin that transforms [[wiki links]] in MDX content
 * into proper HTML anchor tags linking to internal content.
 *
 * Supports:
 * - [[Title]] → links to content matching that title/alias/id
 * - [[Title|Display Text]] → same, but custom display text
 * - Unresolved links render as plain text with a "broken link" indicator
 */

import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

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

// Wiki link regex
const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Load the generated link map using multiple resolution strategies
 */
function loadLinkMap(): LinkMap | null {
  const possiblePaths = [
    path.resolve(process.cwd(), 'src/data/links.json'),
    path.resolve(fileURLToPath(import.meta.url), '../../data/links.json'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      return JSON.parse(content) as LinkMap;
    }
  }

  return null;
}

/**
 * Resolve a wiki link target to a URL
 */
function resolveWikiLink(target: string, linkMap: LinkMap): { href: string; title: string } | null {
  const normalized = target.toLowerCase().trim();
  const item = linkMap.contentMap[normalized];
  if (item) {
    return {
      href: `/${item.id}`,
      title: item.title,
    };
  }
  return null;
}

/**
 * Recursively walk the mdast tree and process text nodes
 */
function walkTree(node: any, linkMap: LinkMap): void {
  if (!node.children) return;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];

    if (child.type === 'text') {
      const value = child.value as string;
      if (!value.includes('[[')) {
        continue;
      }

      const parts: any[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      WIKI_LINK_REGEX.lastIndex = 0;

      while ((match = WIKI_LINK_REGEX.exec(value)) !== null) {
        const target = match[1].trim();
        const displayText = match[2]?.trim() || target;

        // Add text before the link
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            value: value.slice(lastIndex, match.index),
          });
        }

        // Resolve the link
        const resolved = resolveWikiLink(target, linkMap);

        if (resolved) {
          parts.push({
            type: 'link',
            url: resolved.href,
            title: resolved.title,
            children: [{ type: 'text', value: displayText }],
            data: {
              hProperties: {
                className: ['wiki-link'],
              },
            },
          });
        } else {
          // Unresolved link — render as HTML span
          parts.push({
            type: 'html',
            value: `<span class="wiki-link broken" title="Link not found: ${target}">${displayText}</span>`,
          });
        }

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < value.length) {
        parts.push({
          type: 'text',
          value: value.slice(lastIndex),
        });
      }

      if (parts.length > 0) {
        // Splice replacement nodes into parent
        node.children.splice(i, 1, ...parts);
        i += parts.length - 1; // adjust index
      }
    } else {
      // Recurse into child nodes
      walkTree(child, linkMap);
    }
  }
}

const remarkWikiLink: Plugin<[], Root> = () => {
  const linkMap = loadLinkMap();

  return (tree: Root) => {
    if (!linkMap) {
      console.warn('[remark-wiki-link] links.json not found. Run `npm run links` first.');
      return;
    }
    walkTree(tree, linkMap);
  };
};

export default remarkWikiLink;
