import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Colophon',
  description: 'How rturk.me is designed, built, and deployed.',
};

export default function ColophonPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">Colophon</h1>
      <div className="prose prose-invert mt-10">
        <p>
          This site is a headless build. WordPress at <code>cms.rturk.me</code> is the
          editing surface; its content is served over WPGraphQL to a Next.js front end that
          statically generates every page and revalidates it on a schedule (and on demand,
          via a webhook fired when content is saved). Visitors never touch WordPress — they
          get pre-rendered HTML from Netlify&apos;s edge.
        </p>

        <h2>Stack</h2>
        <ul>
          <li><strong>Framework:</strong> Next.js 16 (App Router, React Server Components, ISR)</li>
          <li><strong>UI:</strong> React 19 · TypeScript · Tailwind CSS v4</li>
          <li><strong>Data:</strong> Headless WordPress · WPGraphQL · a small typed fetch client (no Apollo)</li>
          <li><strong>Motion:</strong> a hand-rolled canvas hero · the Motion library for micro-interactions</li>
          <li><strong>Content:</strong> Shiki for server-side syntax highlighting · automatic tables of contents</li>
          <li><strong>Hosting:</strong> Netlify, with edge functions handling ISR revalidation</li>
        </ul>

        <h2>Type</h2>
        <p>
          Headlines are set in <strong>Clash Display</strong>, body copy in{' '}
          <strong>Archivo</strong>, and code and labels in <strong>JetBrains Mono</strong> —
          all self-hosted, no third-party font requests.
        </p>

        <h2>Design</h2>
        <p>
          The palette — codenamed &ldquo;Ion&rdquo; — is a near-black, blue-tinted canvas with a
          single cyan accent. Everything you can interact with respects{' '}
          <code>prefers-reduced-motion</code>: the canvas, the card tilts, and the page
          transitions all quiet down when you ask them to.
        </p>

        <h2>Source</h2>
        <p>
          The repository is public on{' '}
          <a href="https://github.com/RayTurk/rturk-me">GitHub</a> — the build is meant to be
          read, not just used.
        </p>
      </div>
    </div>
  );
}
