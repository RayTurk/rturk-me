import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/api';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs text-ion">case-study/{project.slug}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">{project.title}</h1>
      {project.content && (
        <div
          className="prose prose-invert mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      )}
    </article>
  );
}
