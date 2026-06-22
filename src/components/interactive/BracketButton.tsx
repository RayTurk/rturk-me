'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface BracketButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Renders as a Next.js Link when provided. */
  href?: string;
  /** Renders as a <button> when href is not provided. */
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

const cornerSpring = { type: 'spring' as const, stiffness: 300, damping: 20 };

const CORNERS: Array<{ key: string; border: string; sides: Array<'top' | 'bottom' | 'left' | 'right'> }> = [
  { key: 'tl', border: 'border-l-2 border-t-2', sides: ['top', 'left'] },
  { key: 'tr', border: 'border-r-2 border-t-2', sides: ['top', 'right'] },
  { key: 'bl', border: 'border-l-2 border-b-2', sides: ['bottom', 'left'] },
  { key: 'br', border: 'border-r-2 border-b-2', sides: ['bottom', 'right'] },
];

/**
 * A button/link framed by corner brackets that spring outward on hover and
 * snap back on leave — the "tug and pull" effect. Reserved for primary CTAs.
 * Falls back to a plain styled element under reduced motion.
 */
export default function BracketButton({ children, className, href, type, onClick, disabled }: BracketButtonProps) {
  const reduced = useReducedMotion();
  const offset = useMotionValue(4);
  const springOffset = useSpring(offset, cornerSpring);
  const negOffset = useTransform(springOffset, (o) => -o);

  const baseClass = `relative inline-flex items-center justify-center ${className ?? ''}`;

  if (reduced) {
    if (href) {
      return (
        <Link href={href} className={baseClass}>
          {children}
        </Link>
      );
    }
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={baseClass}>
        {children}
      </button>
    );
  }

  const handlers = {
    onPointerEnter: () => offset.set(12),
    onPointerLeave: () => offset.set(4),
  };

  const content = (
    <>
      {CORNERS.map((corner) => (
        <motion.span
          key={corner.key}
          aria-hidden
          className={`pointer-events-none absolute h-3 w-3 border-ion ${corner.border}`}
          style={{
            top: corner.sides.includes('top') ? negOffset : undefined,
            bottom: corner.sides.includes('bottom') ? negOffset : undefined,
            left: corner.sides.includes('left') ? negOffset : undefined,
            right: corner.sides.includes('right') ? negOffset : undefined,
          }}
        />
      ))}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-ion"
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClass} {...handlers}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClass} {...handlers}>
      {content}
    </button>
  );
}
