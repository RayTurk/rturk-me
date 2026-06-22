'use client';

import { motion } from 'motion/react';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const STAGES = [
  { name: 'WordPress', detail: 'cms.rturk.me' },
  { name: 'WPGraphQL', detail: 'typed queries' },
  { name: 'Next.js 16', detail: 'RSC · ISR' },
  { name: 'Netlify', detail: 'you are here' },
];

/**
 * "Under the Hood" — the headless data pipeline as a staggered diagram that
 * draws itself in on scroll. Doubles as the architecture pitch.
 */
export default function Pipeline() {
  const reduced = useReducedMotion();

  const stages = STAGES.map((stage, i) => (
    <div key={stage.name} className="flex items-center gap-3">
      <motion.div
        {...(reduced ? {} : { variants: fadeUpItem })}
        className="rounded-lg border border-hairline bg-panel px-4 py-3"
      >
        <p className="font-display text-sm font-semibold text-signal">{stage.name}</p>
        <p className="font-mono text-[10px] text-faint">{stage.detail}</p>
      </motion.div>
      {i < STAGES.length - 1 && (
        <span aria-hidden className="font-mono text-ion">
          →
        </span>
      )}
    </div>
  ));

  return (
    <section className="border-t border-hairline py-16">
      <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-faint">03 — Under the Hood</h2>
      {reduced ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">{stages}</div>
      ) : (
        <motion.div
          className="mt-6 flex flex-wrap items-center gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {stages}
        </motion.div>
      )}
      <p className="mt-6 max-w-xl text-sm text-muted">
        WordPress stays the editing experience Ray knows; everything a visitor
        touches is a statically-generated, incrementally-revalidated Next.js app.
        <a href="/colophon" className="ml-1 text-ion underline underline-offset-2 decoration-ion/50 hover:decoration-ion">
          How this site is built →
        </a>
      </p>
    </section>
  );
}
