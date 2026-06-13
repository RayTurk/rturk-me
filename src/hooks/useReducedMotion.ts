'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getInitialValue(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Tracks the user's reduced-motion preference. Returns true when the user
 * has requested reduced motion. SSR-safe: starts false on server, reads
 * matchMedia on first client render, then subscribes to changes.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getInitialValue);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
