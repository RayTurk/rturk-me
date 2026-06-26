'use client';

import { motion } from 'motion/react';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import SectionLabel from '@/components/layout/SectionLabel';

const STAGES = [
  { name: 'WordPress', detail: 'cms.rturk.me' },
  { name: 'WPGraphQL', detail: 'typed queries' },
  { name: 'Next.js 16', detail: 'RSC · ISR' },
  { name: 'Netlify', detail: 'you are here' },
];

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
      <SectionLabel label="section.process" number="03" />
      <h2 className="mt-2 font-display text-2xl font-semibold">Under the Hood</h2>
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
        WordPress stays the editing experience Ray knows; everything a visitor touches is a
        statically-generated, incrementally-revalidated Next.js app.
        <a
          href="/colophon"
          className="ml-1 text-ion underline underline-offset-2 decoration-ion/50 hover:decoration-ion"
        >
          How this site is built →
        </a>
      </p>
    </section>
  );
}
