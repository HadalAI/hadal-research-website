import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt =
  'Qori 1 — a 1.7B model that writes file edits a harness can apply exactly, at 90% on held-out commits';

// satori cannot decode woff2, so the share card uses a bundled serif TTF
const FONT = 'og-serif.ttf';

const bars = [
  { label: 'Qori 1', value: 90.0, us: true },
  { label: 'Qwen2.5-3B', value: 31.7, us: false },
  { label: 'Qwen2.5-7B', value: 23.3, us: false },
];

export default async function Image() {
  const serif = await readFile(path.join(process.cwd(), 'public', 'fonts', FONT));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#faf7f0',
          color: '#16181d',
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 22, letterSpacing: 3, color: '#6c6862' }}>HADAL RESEARCH</span>
          <span style={{ fontSize: 22, letterSpacing: 2, color: '#6c6862' }}>OPEN WEIGHTS · 1.7B</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <span style={{ fontFamily: 'OgSerif', fontSize: 132, lineHeight: 1 }}>Qori 1</span>
          <span style={{ fontSize: 34, lineHeight: 1.35, color: '#6c6862', maxWidth: 900 }}>
            Writes file edits that apply byte-for-byte, with no fuzzy matching.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontSize: 20, color: '#6c6862' }}>
            held-out commits where the emitted block applies exactly once
          </span>
          {bars.map((b) => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ fontSize: 22, width: 190, color: b.us ? '#16181d' : '#6c6862' }}>
                {b.label}
              </span>
              <div style={{ display: 'flex', width: 700, height: 8, background: '#e6e1d8' }}>
                <div
                  style={{
                    width: `${b.value}%`,
                    background: b.us ? '#1c5d5a' : '#9c968c',
                  }}
                />
              </div>
              <span style={{ fontSize: 22, color: b.us ? '#1c5d5a' : '#6c6862' }}>
                {b.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'OgSerif', data: serif, style: 'normal', weight: 400 }] },
  );
}
