'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

/**
 * Counts up from 0 to `value` once scrolled into view. Renders the final
 * value immediately under reduced motion, with no count animation.
 */
export default function AnimatedCounter({ value, suffix = '', label }: AnimatedCounterProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const decimals = value % 1 !== 0 ? 1 : 0;
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Number(latest.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [inView, reduced, value, decimals]);

  return (
    <div className="text-center">
      <span ref={ref} className="font-display text-4xl font-semibold text-signal">
        {display.toFixed(decimals)}{suffix}
      </span>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-faint">{label}</p>
    </div>
  );
}
