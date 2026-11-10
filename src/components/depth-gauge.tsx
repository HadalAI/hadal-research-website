'use client';

import { useEffect, useState } from 'react';

const MAX_DEPTH = 10911; // metres — Challenger Deep, the floor of the hadal zone

/**
 * Scroll read as a depth sounding: the page descends, the gauge counts down to the
 * bottom of the hadal zone. Ornament with an honest scale, not data.
 */
export default function DepthGauge() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const read = () => {
      const el = document.scrollingElement;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0);
    };
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, []);

  const depth = Math.round(progress * MAX_DEPTH);
  const ticks = Array.from({ length: 13 }, (_, i) => i / 12);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-9 top-1/2 z-40 hidden w-[62px] -translate-y-1/2 flex-col items-end gap-2 xl:flex"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6b7178]">
        depth
      </span>
      <span className="tabular whitespace-nowrap font-mono text-[10px] tracking-wide text-[#e2e2de]">
        {depth.toLocaleString('en-US')} m
      </span>
      <div className="relative h-[200px] w-px bg-[#2a3037]">
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute right-0 block h-px bg-[#333a41]"
            style={{ top: `${t * 100}%`, width: t % 0.5 === 0 ? 9 : 4 }}
          />
        ))}
        <span
          className="absolute -right-[3px] block h-[6px] w-[7px] bg-[#7aa7c0]"
          style={{ top: `calc(${progress * 100}% - 2px)` }}
        />
      </div>
      <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.06em] text-[#3d434b]">10,911 m</span>
    </div>
  );
}
