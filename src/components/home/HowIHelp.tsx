import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedBlobs from '@/components/interactive/AnimatedBlobs';

const SERVICES = [
  {
    label: '01',
    title: 'Web Development',
    description:
      'Custom websites and web apps — headless WordPress + Next.js, or whatever stack actually fits the job.',
  },
  {
    label: '02',
    title: 'Hosting & Maintenance',
    description:
      'A monthly retainer covering hosting, updates, backups, and the small fixes that keep a site healthy long after launch.',
  },
  {
    label: '03',
    title: 'Performance & SEO Audits',
    description:
      'A clear-eyed look at load times, Core Web Vitals, and search visibility, with a prioritized list of what to fix first.',
  },
  {
    label: '04',
    title: 'Consulting',
    description: 'A second opinion on an architecture decision or a stuck project — hourly or project-based.',
  },
];

export default function HowIHelp() {
  return (
    <RevealOnScroll>
      <section className="relative overflow-hidden border-t border-hairline py-16">
        <AnimatedBlobs compact />
        <h2 className="relative font-mono text-xs uppercase tracking-[0.15em] text-faint">02 — How I Help</h2>
        <div className="relative mt-6 grid gap-4 md:grid-cols-2">
          {SERVICES.map((service) => (
            <div key={service.label} className="rounded-xl border border-hairline bg-panel p-6">
              <p className="font-mono text-xs text-ion">[{service.label}]</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-signal">{service.title}</h3>
              <p className="mt-2 text-sm text-muted">{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
