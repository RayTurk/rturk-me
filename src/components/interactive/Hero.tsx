import ParticleField from './ParticleField';

/**
 * Homepage hero. Static gradient + text render server-side (SSG); the canvas
 * hydrates and animates client-side only. Status line uses build-time metadata
 * from Netlify's COMMIT_REF (falls back to "dev").
 */
export default function Hero() {
  const commit = (process.env.COMMIT_REF || 'dev').slice(0, 7);
  const context = process.env.CONTEXT || 'local';

  return (
    <section className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.15), transparent 65%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12), transparent 65%)' }}
      />
      <ParticleField />

      <div className="relative">
        <p className="font-mono text-sm text-ion">~/cleveland-oh · full-stack developer</p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
          Ray Turk builds fast, headless, animated web.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          WordPress as the engine, Next.js as the face — with the engineering on display.
        </p>
        <p className="mt-6 font-mono text-xs text-faint">
          <span className="text-[#4ade80]">●</span> main@{commit} · next 16 · deploy: {context}
        </p>
      </div>
    </section>
  );
}
