import { describe, it, expect } from 'vitest';
import { slugify, processPostContent } from '../content';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello, World! Part 2')).toBe('hello-world-part-2');
  });
});

describe('processPostContent', () => {
  it('adds ids to headings and returns a TOC', async () => {
    const { html, toc } = await processPostContent('<h2>First Section</h2><p>text</p><h3>Sub</h3>');
    expect(toc).toEqual([
      { id: 'first-section', text: 'First Section', level: 2 },
      { id: 'sub', text: 'Sub', level: 3 },
    ]);
    expect(html).toContain('id="first-section"');
  });

  it('highlights fenced code blocks with shiki', async () => {
    const input = '<pre><code class="language-ts">const x = 1;</code></pre>';
    const { html } = await processPostContent(input);
    expect(html).toContain('class="shiki');
    expect(html).not.toContain('language-ts">const x = 1;</code>');
  });

  it('leaves plain paragraphs untouched', async () => {
    const { html, toc } = await processPostContent('<p>just text</p>');
    expect(html).toContain('just text');
    expect(toc).toEqual([]);
  });
});
