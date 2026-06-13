import Link from 'next/link';
import { getFeaturedProjects, getRecentPosts } from '@/lib/api';
import RevealOnScroll from '@/components/animations/RevealOnScroll';
import Hero from '@/components/interactive/Hero';
import MagneticButton from '@/components/interactive/MagneticButton';

export const revalidate = 3600;

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getFeaturedProjects(), getRecentPosts(3)]);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Hero />

      {/* Selected work */}
      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-faint">01 — Selected Work</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="rounded-xl border border-hairline bg-panel p-6 transition-colors hover:border-ion/40"
              >
                <p className="font-mono text-xs text-ion">case-study/{project.slug}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{project.title}</h3>
              </Link>
            ))}
          </div>
          <Link href="/work" className="mt-6 inline-block font-mono text-sm text-muted hover:text-ion">
            all work →
          </Link>
        </section>
      </RevealOnScroll>

      {/* Writing */}
      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-faint">02 — Writing</h2>
          <ul className="mt-6 divide-y divide-hairline">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/writing/${post.slug}`} className="flex items-baseline justify-between gap-4 py-4 hover:text-ion">
                  <span>{post.title}</span>
                  <span className="shrink-0 font-mono text-xs text-faint">
                    {post.date ? new Date(post.date).toISOString().slice(0, 10) : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </RevealOnScroll>

      {/* Contact CTA */}
      <RevealOnScroll>
        <section className="border-t border-hairline py-16">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-md text-muted">
              Full-stack developer at Neon Goldfish, building headless WordPress and Next.js sites.
              <Link href="/about" className="ml-2 text-ion">more →</Link>
            </p>
            <MagneticButton href="/contact" className="inline-block rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">
              Get in touch
            </MagneticButton>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
