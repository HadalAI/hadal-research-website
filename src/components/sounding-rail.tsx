'use client';

import { useEffect, useState } from 'react';

const MAX_M = 10900; // Challenger Deep

/** The page as a sounding: scroll position read as depth in metres. */
export default function SoundingRail() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = document.scrollingElement;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const metres = Math.round(pct * MAX_M);
  return (
    <div className="rail" aria-hidden="true">
      <span className="rail-title">Sounding</span>
      {[0.25, 0.5, 0.75].map((t) => (
        <span key={t} className="rail-tick" style={{ top: `${t * 100}%` }} />
      ))}
      <span className="rail-end" style={{ top: '-1.6em' }}>0 m</span>
      <span className="rail-end" style={{ bottom: '-1.6em' }}>10,900 m</span>
      <span className="rail-mark" style={{ top: `${pct * 100}%` }} />
      <span className="rail-label" style={{ top: `${pct * 100}%` }}>
        −{metres.toLocaleString('en-GB')} m
      </span>
    </div>
  );
}
