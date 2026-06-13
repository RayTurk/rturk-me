'use client';

/** Small ⌘K affordance in the header that opens the global palette. */
export default function CommandKHint() {
  return (
    <button
      type="button"
      aria-label="Open command palette"
      onClick={() => document.dispatchEvent(new CustomEvent('command-palette:toggle'))}
      className="hidden rounded-md border border-hairline px-2 py-1 font-mono text-xs text-faint transition-colors hover:text-ion sm:inline-block"
    >
      ⌘K
    </button>
  );
}
