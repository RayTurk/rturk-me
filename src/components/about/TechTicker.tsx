'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TechTickerProps {
  items: string[];
}

/** Infinite horizontal scroll of tag chips. Renders a static wrapped list under reduced motion. */
export default function TechTicker({ items }: TechTickerProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="flex flex-wrap gap-3 font-mono text-xs text-faint">
        {items.map((item) => (
          <span key={item} className="rounded border border-hairline px-3 py-1">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-3 font-mono text-xs text-faint"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="shrink-0 rounded border border-hairline px-3 py-1">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
