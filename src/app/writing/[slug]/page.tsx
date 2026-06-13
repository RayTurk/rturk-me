import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPostSlugs } from '@/lib/api';
import { processPostContent } from '@/lib/content';
import TableOfContents from '@/components/blog/TableOfContents';

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

  const { html, toc } = await processPostContent(post.content ?? '');

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        <article className="min-w-0 max-w-3xl">
          <p className="font-mono text-xs text-faint">
            {post.date ? new Date(post.date).toISOString().slice(0, 10) : ''}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold">{post.title}</h1>
          <div
            className="prose prose-invert mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
        <aside className="mt-12 hidden lg:sticky lg:top-24 lg:mt-0 lg:block lg:self-start">
          <TableOfContents toc={toc} />
        </aside>
      </div>
    </div>
  );
}
