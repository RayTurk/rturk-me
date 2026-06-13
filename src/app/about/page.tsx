import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Ray Turk — full-stack web developer in Cleveland, Ohio. Headless WordPress, Next.js, and the occasional shader.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">About</h1>
      <div className="prose prose-invert mt-10">
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
        <h2>What I work with</h2>
        <p>
          Next.js · React · TypeScript · WordPress · WPGraphQL · PHP · Laravel · Tailwind ·
          MySQL. I care about performance budgets, accessible motion, and code that the next
          developer can actually read.
        </p>
        <h2>Beyond the editor</h2>
        <p>
          I&apos;m happiest when a gnarly integration finally clicks — a headless build that
          loads instantly, a CMS that non-technical editors genuinely enjoy, a deploy
          pipeline that just works. If you want to talk shop or have something to build,
          the <a href="/contact">contact page</a> is the fastest way to reach me.
        </p>
      </div>
    </div>
  );
}
