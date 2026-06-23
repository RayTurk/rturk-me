'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface CareerEntry {
  role: string;
  company: string;
  location: string;
  dates: string;
  tag: string;
  highlights: string[];
}

interface CareerTimelineProps {
  entries: CareerEntry[];
}

/** Git-commit-styled work history. The connecting line's height tracks scroll progress through the timeline; renders fully drawn under reduced motion. */
export default function CareerTimeline({ entries }: CareerTimelineProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className="relative pl-8">
      {reduced ? (
        <div className="absolute left-0 top-0 w-px bg-ion" style={{ height: '100%' }} />
      ) : (
        <motion.div className="absolute left-0 top-0 w-px bg-ion" style={{ height: lineHeight }} />
      )}
      <div className="space-y-10">
        {entries.map((entry) => (
          <RevealOnScroll key={`${entry.company}-${entry.role}`}>
            <article className="relative">
              <span className="absolute -left-8 top-1.5 h-2 w-2 rounded-full bg-ion" />
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="font-display text-lg font-semibold text-signal">
                  {entry.role} · {entry.company}
                </h3>
                <span className="rounded border border-hairline px-2 py-0.5 font-mono text-[10px] text-ion">
                  {entry.tag}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-faint">
                {entry.location} · {entry.dates}
              </p>
              <div className="mt-3 rounded-lg bg-void p-4 font-mono text-xs">
                {entry.highlights.map((highlight) => (
                  <p key={highlight} className="text-muted">
                    <span className="text-ion">+ </span>
                    {highlight}
                  </p>
                ))}
              </div>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
