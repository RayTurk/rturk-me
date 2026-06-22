import ParticleField from './ParticleField';
import AnimatedBlobs from './AnimatedBlobs';

/**
 * Homepage hero. Static gradient + text render server-side (SSG); the canvas
 * and blobs hydrate and animate client-side only. Status line uses build-time
 * metadata from Netlify's COMMIT_REF (falls back to "dev").
 */
export default function Hero() {
  const commit = (process.env.COMMIT_REF || 'dev').slice(0, 7);
  const context = process.env.CONTEXT || 'local';

  return (
    <section className="relative overflow-hidden py-24">
      <AnimatedBlobs />
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
