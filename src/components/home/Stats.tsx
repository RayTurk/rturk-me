import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import AnimatedBlobs from '@/components/interactive/AnimatedBlobs';

const STATS = [
  { value: 6, suffix: '+', label: 'years' },
  { value: 30, suffix: '+', label: 'sites shipped' },
  { value: 99.9, suffix: '%', label: 'uptime' },
  { value: 95, suffix: '', label: 'avg lighthouse score' },
];

/** Quick credibility strip directly under the hero — no section number, matching the hero's own unnumbered treatment. */
export default function Stats() {
  return (
    <RevealOnScroll>
      <section className="relative overflow-hidden border-t border-hairline py-12">
        <AnimatedBlobs compact />
        <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
