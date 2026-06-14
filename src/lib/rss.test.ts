import { describe, it, expect } from 'vitest';
import { buildRssXml } from './rss';

describe('buildRssXml', () => {
  const items = [
    { title: 'First & Best', slug: 'first', date: '2026-06-01T00:00:00', excerpt: 'one <b>two</b>' },
    { title: 'Second', slug: 'second', date: '2026-05-01T00:00:00', excerpt: 'plain' },
  ];

  it('produces a channel with the site title and link', () => {
    const xml = buildRssXml(items, 'https://rturk.me');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<link>https://rturk.me</link>');
  });

  it('emits one item per post with an absolute /writing link', () => {
    const xml = buildRssXml(items, 'https://rturk.me');
    expect(xml).toContain('<link>https://rturk.me/writing/first</link>');
    expect(xml).toContain('<link>https://rturk.me/writing/second</link>');
    expect((xml.match(/<item>/g) || []).length).toBe(2);
  });

  it('escapes XML-special characters in titles', () => {
    const xml = buildRssXml(items, 'https://rturk.me');
    expect(xml).toContain('First &amp; Best');
    expect(xml).not.toContain('First & Best');
  });
});
