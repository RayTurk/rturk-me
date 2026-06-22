'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedBlobsProps {
  /** Smaller, dimmer pair for reuse as a background accent below the hero. */
  compact?: boolean;
}

/**
 * Two drifting, scroll-parallaxing gradient blobs used as a decorative
 * background layer. Must be the child of a `relative overflow-hidden`
 * container. Renders static, non-parallaxing blobs under reduced motion.
 */
export default function AnimatedBlobs({ compact = false }: AnimatedBlobsProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxA = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const parallaxB = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const sizeA = compact ? 'h-48 w-48' : 'h-72 w-72';
  const sizeB = compact ? 'h-40 w-40' : 'h-64 w-64';
  const opacityA = compact ? 'opacity-30' : 'opacity-60';
  const opacityB = compact ? 'opacity-20' : 'opacity-40';

  if (reduced) {
    return (
      <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-20 right-0 rounded-full ${sizeA} ${opacityA}`}
          style={{ background: 'radial-gradient(circle, rgba(255,66,0,0.15), transparent 65%)' }}
        />
        <div
          className={`absolute bottom-0 left-1/3 rounded-full ${sizeB} ${opacityB}`}
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12), transparent 65%)' }}
        />
      </div>
    );
  }

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className={`absolute -top-20 right-0 rounded-full ${sizeA} ${opacityA}`}
        style={{ background: 'radial-gradient(circle, rgba(255,66,0,0.15), transparent 65%)', y: parallaxA }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute bottom-0 left-1/3 rounded-full ${sizeB} ${opacityB}`}
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12), transparent 65%)', y: parallaxB }}
        animate={{ scale: [1, 1.1, 1], x: [0, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
