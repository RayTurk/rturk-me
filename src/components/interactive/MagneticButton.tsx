'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { springSoft } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MotionLink = motion.create(Link);

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A link that magnetically eases toward the pointer and springs back on leave.
 * Falls back to a plain styled Link under reduced motion. Uses motion.create(Link)
 * so internal navigation stays client-side.
 */
export default function MagneticButton({ href, children, className }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springSoft);
  const sy = useSpring(y, springSoft);

  if (reduced) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * 0.3);
    y.set(my * 0.3);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <MotionLink
      ref={ref as never}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </MotionLink>
  );
}
