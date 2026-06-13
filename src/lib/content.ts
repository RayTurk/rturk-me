import { parse, HTMLElement } from 'node-html-parser';
import { getHighlighter, SHIKI_THEME, SUPPORTED_LANGS } from './highlighter';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

const SUPPORTED = new Set<string>(SUPPORTED_LANGS);

/** URL-safe slug from heading text. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Processes WordPress post HTML for the front-end:
 *  - assigns slug ids to h2/h3 and returns a table of contents
 *  - re-highlights <pre><code class="language-x"> blocks with Shiki
 * Server-only (Shiki + DOM parse happen at build/ISR time).
 */
export async function processPostContent(
  html: string
): Promise<{ html: string; toc: TocEntry[] }> {
  const root = parse(html, { comment: false });
  const toc: TocEntry[] = [];

  for (const el of root.querySelectorAll('h2, h3')) {
    const text = el.text.trim();
    if (!text) continue;
    const id = slugify(text);
    el.setAttribute('id', id);
    // rawTagName returns lowercase ('h2' or 'h3'); tagName returns uppercase
    toc.push({ id, text, level: el.rawTagName === 'h2' ? 2 : 3 });
  }

  const highlighter = await getHighlighter();
  for (const pre of root.querySelectorAll('pre')) {
    // node-html-parser treats <pre> content as raw text, so we re-parse its
    // innerHTML to locate the nested <code> element and its attributes.
    const innerRoot = parse(pre.innerHTML);
    const code = innerRoot.querySelector('code');
    if (!code) continue;
    const langMatch = (code.getAttribute('class') || '').match(/language-([\w-]+)/);
    const lang = langMatch && SUPPORTED.has(langMatch[1]) ? langMatch[1] : 'text';
    const source = decodeEntities(code.text);
    const highlighted = highlighter.codeToHtml(source, { lang, theme: SHIKI_THEME });
    const replacement = parse(highlighted) as unknown as HTMLElement;
    pre.replaceWith(replacement);
  }

  return { html: root.toString(), toc };
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'");
}
