import Link from 'next/link';
import { getFeaturedProjects, getRecentPosts } from '@/lib/api';

export const revalidate = 3600;

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getFeaturedProjects(), getRecentPosts(3)]);

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero — static gradient version; interactive canvas lands in Plan 2 */}
      <section className="relative overflow-hidden py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.15), transparent 65%)' }}
        />
        <p className="font-mono text-sm text-ion">~/cleveland-oh · full-stack developer</p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
          Ray Turk builds fast, headless, animated web.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          WordPress as the engine, Next.js as the face — with the engineering on display.
        </p>
      </section>

      {/* Selected work */}
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

      {/* Writing */}
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

      {/* Contact CTA */}
      <section className="border-t border-hairline py-16">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-md text-muted">
            Full-stack developer at Neon Goldfish, building headless WordPress and Next.js sites.
            <Link href="/about" className="ml-2 text-ion">more →</Link>
          </p>
          <Link href="/contact" className="rounded-lg bg-ion px-5 py-2.5 font-semibold text-void hover:opacity-90">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
