'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** Server snapshot is always false — motion is enabled until the client says otherwise. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Tracks the user's reduced-motion preference. Returns true when the user has
 * requested reduced motion. SSR-safe via useSyncExternalStore: the server
 * renders `false`, the client subscribes to the media query — no hydration
 * mismatch, no setState-in-effect.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
