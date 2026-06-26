import type { Metadata } from 'next';
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import GridScatter from '@/components/about/GridScatter';
import IconGlyph from '@/components/icons/IconGlyph';
import TechTicker from '@/components/about/TechTicker';
import CareerTimeline from '@/components/about/CareerTimeline';
import BracketButton from '@/components/interactive/BracketButton';
import SectionLabel from '@/components/layout/SectionLabel';
import { PROFILE_STATS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Ray Turk — full-stack web developer in Cleveland, Ohio. Headless WordPress, Next.js, and the occasional shader.',
};

const TECH_TICKER_ITEMS = [
  'Next.js', 'React', 'TypeScript', 'WordPress', 'WPGraphQL', 'PHP', 'Laravel', 'Tailwind',
  'MySQL', 'Git', 'Docker', 'AWS', 'Node.js', 'Accessibility', 'Performance', 'E-commerce',
];

const PRINCIPLES = [
  {
    icon: 'cross' as const,
    title: 'Maintainability over cleverness',
    description:
      'Code the next developer (including future-me) can actually read and extend, not just code that works today.',
  },
  {
    icon: 'dots' as const,
    title: 'Client empowerment over gatekeeping',
    description:
      'Give non-technical clients real control over their own content (custom shortcodes, flexible layouts) instead of making every change depend on me.',
  },
  {
    icon: 'square' as const,
    title: 'Performance and reliability are features, not afterthoughts',
    description: 'Load times, uptime, and Core Web Vitals are deliverables I measure, not nice-to-haves.',
  },
  {
    icon: 'scatter' as const,
    title: 'Diagnose before you patch',
    description: 'Dig into the actual root cause methodically rather than shotgunning fixes and hoping.',
  },
];

const BOUNDARIES = [
  'Open-ended "make it pop" requests with no clear brief or decision-maker.',
  "Quick patches on a codebase nobody's willing to actually let me fix.",
  'Free, unpaid scope creep — ongoing support belongs in a retainer, not a favor.',
  'Vendor or platform lock-in that leaves a client without real ownership of their own site.',
  'Work where "ship it fast" matters more than "won\'t break in six months."',
];

const CAREER_ENTRIES = [
  {
    role: 'Full-Stack Developer',
    company: 'Neon Goldfish',
    location: 'Toledo, OH',
    dates: 'May 2025–Present',
    tag: 'WordPress',
    highlights: [
      "Engineered 3–4 custom child themes that extended the agency's parent theme, implementing site-specific overrides and ACF flexible content layouts to empower clients with backend control over page composition.",
      'Refactored core logic and overhauled core databases while maintaining existing client workflows, modernizing codebases.',
      'Developed custom plugins for WooCommerce, SUMO Subscriptions, and GravityForms, including a bulk user import tool using Action Scheduler and a progressive pricing calculator for a service-industry manufacturer.',
      'Managed server infrastructure across Linode, WP Engine, and DigitalOcean, optimizing PHP-FPM settings, troubleshooting DOM issues, and configuring Redis/Varnish object caching to enhance performance.',
      'Integrated and debugged third-party payment and marketing APIs such as Stripe, PayPal, and Square, ensuring seamless transaction processes for clients.',
    ],
  },
  {
    role: 'WordPress Developer',
    company: 'Full Spectrum Marketing',
    location: 'Akron, OH',
    dates: 'April 2024–March 2025',
    tag: 'WordPress',
    highlights: [
      'Engineered WordPress performance optimizations that achieved a 60% reduction in page load times and consistently maintained Google PageSpeed scores of 90%+ across client sites.',
      'Designed custom shortcodes that enabled non-technical clients to create complex, dynamic content layouts without coding knowledge.',
      'Developed bespoke WordPress plugins tailored to client specifications, enhancing core CMS functionality and delivering essential features for business needs.',
    ],
  },
  {
    role: 'Web Developer',
    company: 'Company 119',
    location: 'Chardon, OH',
    dates: 'March 2021–February 2024',
    tag: 'WordPress',
    highlights: [
      'Led all WordPress maintenance operations, managing a diverse portfolio of client websites while ensuring 99.9% uptime and rapid issue resolution.',
      'Engineered a comprehensive ticketing system with custom automations that improved workflow efficiency, reducing average response time from 24 hours to under 4 hours.',
      'Developed custom WordPress themes from concept to deployment, delivering unique, responsive designs that aligned with client brand guidelines.',
      'Optimized website performance through caching implementation, database optimization, and image compression, resulting in significant enhancements to page load speeds and user experience.',
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <RevealOnScroll>
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-xl">
            <SectionLabel label="page.about" />
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

      {/* My Story — border-ion accent divider */}
      <RevealOnScroll>
        <section className="relative overflow-hidden border-t border-ion py-16">
          <GridScatter />
          <SectionLabel label="section.my-story" number="02" />
          <h2 className="mt-2 font-display text-2xl font-semibold">My Story</h2>
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

      <RevealOnScroll>
        <section className="border-t border-hairline py-10">
          <TechTicker items={TECH_TICKER_ITEMS} />
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <SectionLabel label="section.principles" number="03" />
          <h2 className="mt-2 font-display text-2xl font-semibold">How I Think About Work</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="rounded-xl border border-hairline bg-panel p-6">
                <IconGlyph variant={principle.icon} className="text-ion" />
                <h3 className="mt-2 font-display text-lg font-semibold text-signal">{principle.title}</h3>
                <p className="mt-2 text-sm text-muted">{principle.description}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <h2 className="font-display text-2xl font-semibold">What I Don&apos;t Do</h2>
          <p className="mt-2 text-muted">I like to be upfront about this. It saves both of us time.</p>
          <ul className="mt-6 space-y-3">
            {BOUNDARIES.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted">
                <span className="text-ion">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <SectionLabel label="section.career" number="04" />
          <h2 className="mt-2 font-display text-2xl font-semibold">Career Commits</h2>
          <p className="mt-2 text-muted">A version-controlled history of growth and impact.</p>
          <div className="mt-8">
            <CareerTimeline entries={CAREER_ENTRIES} />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-md text-muted">Have a project or a role in mind? Send a note.</p>
            <BracketButton href="/contact" className="rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">
              Get in touch
            </BracketButton>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
