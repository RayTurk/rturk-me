import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Ray Turk — full-stack developer in Cleveland, OH.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">About</h1>
      <div className="prose prose-invert mt-10">
        <p>
          I&apos;m Ray Turk, a full-stack developer in Cleveland, Ohio. By day I build client
          sites at Neon Goldfish; the rest of the time I&apos;m deep in headless WordPress,
          Next.js, and whatever the platform shipped this month.
        </p>
        <h2>Stack</h2>
        <p>Next.js · React · TypeScript · WordPress · WPGraphQL · PHP · Laravel · Tailwind</p>
      </div>
    </div>
  );
}
