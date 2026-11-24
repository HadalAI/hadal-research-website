'use client';

type Row = { label: string; value: number; tone?: 'us' | 'base' };

/**
 * Minimal horizontal bar chart. No gridlines, no boxes — a hairline rail per value and the
 * number set in the margin, so the page keeps the reading-first layout of the rest of the site.
 */
export default function BarChart({
  heading,
  note,
  rows,
  max = 100,
  unit = '%',
}: {
  heading: string;
  note?: string;
  rows: Row[];
  max?: number;
  unit?: string;
}) {
  return (
    <figure style={{ margin: 0 }}>
      <figcaption
        className="meta"
        style={{ marginBottom: '0.9rem', display: 'flex', justifyContent: 'space-between',
                 gap: '1rem', alignItems: 'baseline' }}
      >
        <span>{heading}</span>
        <span style={{ color: 'var(--muted)', fontSize: '0.66rem' }}>0–{max}{unit}</span>
      </figcaption>
      <div style={{ display: 'grid', gap: '0.45rem', minWidth: 0 }}>
        {rows.map((r) => (
          <div
            key={r.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '8.5rem minmax(0, 1fr) 3rem',
              minWidth: 0,
              alignItems: 'center',
              columnGap: '0.9rem',
            }}
          >
            <span className="meta" style={{ color: r.tone === 'us' ? 'var(--ink)' : 'var(--muted)' }}>
              {r.label}
            </span>
            <span
              style={{
                position: 'relative',
                height: '5px',
                background: 'var(--rule, #e6e1d8)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: `${Math.max(0, Math.min(100, (r.value / max) * 100))}%`,
                  background: r.tone === 'us' ? 'var(--accent)' : 'var(--muted)',
                  opacity: r.tone === 'us' ? 1 : 0.42,
                }}
              />
            </span>
            <span
              className="meta"
              style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                       color: r.tone === 'us' ? 'var(--ink)' : 'var(--muted)' }}
            >
              {r.value.toFixed(1)}{unit}
            </span>
          </div>
        ))}
      </div>
      {note ? (
        <p className="meta muted" style={{ marginTop: '0.9rem', marginBottom: 0 }}>{note}</p>
      ) : null}
    </figure>
  );
}
