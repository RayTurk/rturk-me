import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/api';

export const revalidate = 3600;
export const metadata: Metadata = { title: 'Writing', description: 'Technical writing by Ray Turk.' };

export default async function WritingPage() {
  const { posts } = await getAllPosts(100);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">Writing</h1>
      <ul className="mt-10 divide-y divide-hairline">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="flex items-baseline justify-between gap-4 py-4 hover:text-ion"
            >
              <span>{post.title}</span>
              <span className="shrink-0 font-mono text-xs text-faint">
                {post.date ? new Date(post.date).toISOString().slice(0, 10) : ''}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
