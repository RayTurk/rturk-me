'use client';

import dynamic from 'next/dynamic';

const CommandPalette = dynamic(() => import('./CommandPalette'), { ssr: false });

/** Client wrapper that lazy-loads the command palette in its own chunk. */
export default function CommandPaletteLoader() {
  return <CommandPalette />;
}
