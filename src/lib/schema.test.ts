import { describe, it, expect } from 'vitest';
import {
  generatePersonSchema,
  generateWebSiteSchema,
  generateArticleSchema,
  generateCreativeWorkSchema,
} from './schema';

describe('schema generators', () => {
  it('Person schema has the right identity', () => {
    const s = generatePersonSchema();
    expect(s['@type']).toBe('Person');
    expect(s.name).toBe('Ray Turk');
    expect(s.sameAs.some((u: string) => u.includes('github.com/RayTurk'))).toBe(true);
  });

  it('WebSite schema points at the site url', () => {
    const s = generateWebSiteSchema();
    expect(s['@type']).toBe('WebSite');
    expect(s.url).toContain('rturk.me');
  });

  it('Article schema carries headline + url', () => {
    const s = generateArticleSchema(
      { title: 'My Post', date: '2026-06-01T00:00:00', excerpt: 'hi' },
      'https://rturk.me/writing/my-post'
    );
    expect(s['@type']).toBe('Article');
    expect(s.headline).toBe('My Post');
    expect(s.url).toBe('https://rturk.me/writing/my-post');
    expect(s.author.name).toBe('Ray Turk');
  });

  it('CreativeWork schema carries name + url', () => {
    const s = generateCreativeWorkSchema(
      { title: 'Cool Project' },
      'https://rturk.me/work/cool-project'
    );
    expect(s['@type']).toBe('CreativeWork');
    expect(s.name).toBe('Cool Project');
    expect(s.url).toBe('https://rturk.me/work/cool-project');
  });
});
