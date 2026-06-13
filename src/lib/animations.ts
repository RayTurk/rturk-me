import type { Variants } from 'motion/react';

/** Container that staggers its children in. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** A single item that fades and rises into place. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 30 },
  },
};

/** Spring config reused by magnetic/tilt interactions. */
export const springSoft = { type: 'spring' as const, stiffness: 150, damping: 15, mass: 0.6 };
