import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPostSlugs } from '@/lib/api';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs text-faint">
        {post.date ? new Date(post.date).toISOString().slice(0, 10) : ''}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold">{post.title}</h1>
      <div
        className="prose prose-invert mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
      />
    </article>
  );
}
