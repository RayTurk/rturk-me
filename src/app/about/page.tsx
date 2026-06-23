import type { Metadata } from 'next';
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import GridScatter from '@/components/about/GridScatter';
import { PROFILE_STATS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Ray Turk — full-stack web developer in Cleveland, Ohio. Headless WordPress, Next.js, and the occasional shader.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <RevealOnScroll>
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-xl">
            <p className="font-mono text-xs text-ion">// index.about</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">About</h1>
            <p className="mt-4 text-lg text-muted">
              Full-stack developer in Cleveland, Ohio, building WordPress-powered sites that are
              fast, maintainable, and actually easy for clients to run.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#4ade80]/30 bg-[#4ade80]/10 px-3 py-1 font-mono text-xs text-[#4ade80]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
              Open to new projects
            </p>
          </div>
          <img
            src="/images/Headshot.jpg"
            alt="Ray Turk"
            width={160}
            height={160}
            className="rounded-xl border border-hairline object-cover"
          />
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="mt-10 grid grid-cols-2 gap-8 border-t border-hairline py-8 md:grid-cols-4 md:divide-x md:divide-hairline">
          {PROFILE_STATS.map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="relative overflow-hidden border-t border-hairline py-16">
          <GridScatter />
          <h2 className="relative font-mono text-xs uppercase tracking-[0.15em] text-faint">02 — My Story</h2>
          <div className="prose prose-invert relative mt-6">
            <p>
              I&apos;m Ray Turk, a full-stack web developer based in Cleveland, Ohio. I build
              for the web at <a href="https://neongoldfish.com">Neon Goldfish</a>, a Cleveland
              marketing agency, where most of my days are spent in WordPress — custom themes,
              ACF-driven page builders, and the occasional rescue of a site that has seen
              better days.
            </p>
            <p>
              Outside the agency I run <a href="https://codetheland.com">Code The Land</a>, my
              freelance brand, and I keep this site as a place to push past client constraints:
              headless architectures, real-time interfaces, motion, and whatever the platform
              shipped this month. If client work is about reliability, this is where I get to
              be curious.
            </p>
            <h3>What I work with</h3>
            <p>
              Next.js · React · TypeScript · WordPress · WPGraphQL · PHP · Laravel · Tailwind ·
              MySQL. I care about performance budgets, accessible motion, and code that the next
              developer can actually read.
            </p>
            <h3>Beyond the editor</h3>
            <p>
              I&apos;m happiest when a gnarly integration finally clicks — a headless build that
              loads instantly, a CMS that non-technical editors genuinely enjoy, a deploy
              pipeline that just works. If you want to talk shop or have something to build,
              the <a href="/contact">contact page</a> is the fastest way to reach me.
            </p>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
