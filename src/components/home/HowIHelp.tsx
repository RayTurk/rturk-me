import RevealOnScroll from '@/components/animations/RevealOnScroll';
import IconGlyph from '@/components/icons/IconGlyph';
import SectionLabel from '@/components/layout/SectionLabel';

const SERVICES = [
  {
    icon: 'cross' as const,
    title: 'Web Development',
    description:
      'Custom websites and web apps — headless WordPress + Next.js, or whatever stack actually fits the job.',
  },
  {
    icon: 'dots' as const,
    title: 'Hosting & Maintenance',
    description:
      'A monthly retainer covering hosting, updates, backups, and the small fixes that keep a site healthy long after launch.',
  },
  {
    icon: 'square' as const,
    title: 'Performance & SEO Audits',
    description:
      'A clear-eyed look at load times, Core Web Vitals, and search visibility, with a prioritized list of what to fix first.',
  },
  {
    icon: 'scatter' as const,
    title: 'Consulting',
    description: 'A second opinion on an architecture decision or a stuck project — hourly or project-based.',
  },
];

export default function HowIHelp() {
  return (
    <RevealOnScroll>
      <section className="border-t border-hairline py-16">
        <SectionLabel label="section.how-i-help" number="02" />
        <h2 className="mt-2 font-display text-2xl font-semibold">How I Help</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SERVICES.map((service) => (
            <div key={service.title} className="rounded-xl border border-hairline bg-panel p-6">
              <IconGlyph variant={service.icon} className="text-ion" />
              <h3 className="mt-2 font-display text-lg font-semibold text-signal">{service.title}</h3>
              <p className="mt-2 text-sm text-muted">{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
