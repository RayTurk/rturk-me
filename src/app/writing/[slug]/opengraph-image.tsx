import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/api';

export const alt = 'Ray Turk — Writing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? 'Writing';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0b0f',
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', color: '#ff4200', fontSize: 24, fontFamily: 'monospace' }}>
          rturk.me / writing
        </div>
        <div style={{ display: 'flex', color: '#f0f2f8', fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>
          {title}
        </div>
        <div style={{ display: 'flex', color: '#9aa3b5', fontSize: 22 }}>Ray Turk</div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 0, left: 0, width: '100%', height: 8, background: '#ff4200' }} />
      </div>
    ),
    { ...size }
  );
}
