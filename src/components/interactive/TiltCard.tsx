'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { springSoft } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MotionLink = motion.create(Link);

interface TiltCardProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A link card that tilts toward the pointer in 3D. Reduced motion → a plain
 * Link with the same classes (no transform).
 */
export default function TiltCard({ href, children, className }: TiltCardProps) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), springSoft);
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), springSoft);

  if (reduced) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  function onMove(e: React.PointerEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <MotionLink
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </MotionLink>
  );
}
