'use client';

import { motion } from 'motion/react';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** When true, children are wrapped individually for a stagger effect. */
  stagger?: boolean;
}

/**
 * Reveals content as it scrolls into view. Honors reduced motion by rendering
 * children statically (no transform/opacity animation).
 */
export default function RevealOnScroll({ children, className, stagger = false }: RevealOnScrollProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={stagger ? staggerContainer : fadeUpItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered child for use inside a `stagger` RevealOnScroll container. */
export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUpItem}>
      {children}
    </motion.div>
  );
}
