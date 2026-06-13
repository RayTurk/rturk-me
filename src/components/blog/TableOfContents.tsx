import type { TocEntry } from '@/lib/content';

/** Sticky table of contents rendered beside a post. */
export default function TableOfContents({ toc }: { toc: TocEntry[] }) {
  if (toc.length === 0) return null;
  return (
    <nav aria-label="Table of contents" className="font-mono text-xs">
      <p className="mb-3 uppercase tracking-wider text-faint">On this page</p>
      <ul className="space-y-2">
        {toc.map((entry) => (
          <li key={entry.id} className={entry.level === 3 ? 'pl-3' : ''}>
            <a href={`#${entry.id}`} className="text-muted transition-colors hover:text-ion">
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
