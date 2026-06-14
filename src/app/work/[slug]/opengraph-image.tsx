import { ImageResponse } from 'next/og';
import { getProjectBySlug } from '@/lib/api';

export const alt = 'Ray Turk — Work';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const title = project?.title ?? 'Case Study';

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
        <div style={{ display: 'flex', color: '#22d3ee', fontSize: 24, fontFamily: 'monospace' }}>
          rturk.me / work
        </div>
        <div style={{ display: 'flex', color: '#f0f2f8', fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>
          {title}
        </div>
        <div style={{ display: 'flex', color: '#9aa3b5', fontSize: 22 }}>Case study · Ray Turk</div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 0, left: 0, width: '100%', height: 8, background: '#22d3ee' }} />
      </div>
    ),
    { ...size }
  );
}
