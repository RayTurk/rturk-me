import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Colophon',
  description: 'How rturk.me is built.',
};

export default function ColophonPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">Colophon</h1>
      <div className="prose prose-invert mt-10">
        <p>
          This site is a headless build: WordPress at cms.rturk.me serves content over
          WPGraphQL to a Next.js 16 App Router front-end, statically generated with ISR
          and deployed to Netlify.
        </p>
        <ul>
          <li>Next.js 16 · React 19 · TypeScript · Tailwind v4</li>
          <li>Typed data layer over a fetch-based GraphQL client — no client-side fetching for content</li>
          <li>Type: Clash Display, Archivo, JetBrains Mono — all self-hosted</li>
        </ul>
      </div>
    </div>
  );
}
