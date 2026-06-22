'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DOT_GRID_STYLE = {
  backgroundImage: 'radial-gradient(circle, rgba(240,242,248,0.06) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

/**
 * Sitewide faint dot-grid texture, fixed behind all page content. Drifts
 * very slowly under normal motion; renders as a static pattern under
 * reduced motion.
 */
export default function DotGrid() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={DOT_GRID_STYLE} />
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={DOT_GRID_STYLE}
      animate={{ backgroundPosition: ['0px 0px', '24px 24px'] }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    />
  );
}
