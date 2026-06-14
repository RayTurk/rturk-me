import { SITE_NAME, SITE_URL } from './constants';

export interface RssItem {
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
};

/**
 * Decodes HTML entities (numeric + common named) that WordPress excerpts arrive
 * pre-encoded with (e.g. `&#8217;`, `&hellip;`). Must run BEFORE escapeXml so
 * those become real Unicode characters rather than double-escaped `&amp;#8217;`.
 */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (match, name) => NAMED_ENTITIES[name] ?? match);
}

/** RSS 2.0 feed for the writing section. Pure string builder — no I/O. */
export function buildRssXml(items: RssItem[], siteUrl: string = SITE_URL): string {
  const now = new Date().toUTCString();
  const entries = items
    .map((item) => {
      const link = `${siteUrl}/writing/${item.slug}`;
      const pubDate = item.date ? new Date(item.date).toUTCString() : now;
      const description = escapeXml(
        decodeEntities((item.excerpt || '').replace(/<[^>]+>/g, '')).trim()
      );
      return [
        '    <item>',
        `      <title>${escapeXml(item.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid>${link}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${description}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(SITE_NAME)} — Writing</title>`,
    `    <link>${siteUrl}</link>`,
    '    <description>Technical writing by Ray Turk.</description>',
    `    <lastBuildDate>${now}</lastBuildDate>`,
    `    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />`,
    entries,
    '  </channel>',
    '</rss>',
  ].join('\n');
}
