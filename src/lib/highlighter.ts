import { createHighlighter, type Highlighter } from 'shiki';

export const SUPPORTED_LANGS = [
  'ts', 'tsx', 'js', 'jsx', 'bash', 'shell', 'json', 'php', 'html', 'css', 'graphql', 'sql', 'yaml', 'md',
] as const;

export const SHIKI_THEME = 'github-dark-default';

let instance: Promise<Highlighter> | null = null;

/** Lazily-created shared Shiki highlighter (one instance per server process). */
export function getHighlighter(): Promise<Highlighter> {
  if (!instance) {
    instance = createHighlighter({
      themes: [SHIKI_THEME],
      langs: [...SUPPORTED_LANGS],
    });
  }
  return instance;
}
