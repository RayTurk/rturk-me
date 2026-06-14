import { getAllPosts } from '@/lib/api';
import { buildRssXml, type RssItem } from '@/lib/rss';

export const revalidate = 3600;

export async function GET() {
  const { posts } = await getAllPosts(100);
  const items: RssItem[] = posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    date: p.date,
    excerpt: p.excerpt,
  }));
  const xml = buildRssXml(items);
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
