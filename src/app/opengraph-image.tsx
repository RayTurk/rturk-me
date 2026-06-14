import { ImageResponse } from 'next/og';

export const alt = 'Ray Turk — Full-Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
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
        <div style={{ display: 'flex', color: '#22d3ee', fontSize: 28, fontFamily: 'monospace' }}>
          rturk.me
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', color: '#f0f2f8', fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            Ray Turk builds fast,
          </div>
          <div style={{ display: 'flex', color: '#f0f2f8', fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            headless, animated web.
          </div>
        </div>
        <div style={{ display: 'flex', color: '#9aa3b5', fontSize: 24 }}>
          Full-Stack Developer · Cleveland, OH
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 0, left: 0, width: '100%', height: 8, background: '#22d3ee' }} />
      </div>
    ),
    { ...size }
  );
}
