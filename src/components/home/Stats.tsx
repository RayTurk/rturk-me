import RevealOnScroll from '@/components/animations/RevealOnScroll';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import { PROFILE_STATS } from '@/lib/constants';

/** Quick credibility strip directly under the hero — no section number, matching the hero's own unnumbered treatment. */
export default function Stats() {
  return (
    <RevealOnScroll>
      <section className="border-t border-hairline py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-hairline">
          {PROFILE_STATS.map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
