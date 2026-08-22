'use client';

import { useEffect, useState } from 'react';

type Entry = { time: string; text: string };

const POOL = [
  'evaluation batch completed',
  'worker heartbeat received',
  'new contributor joined the network',
  'dataset contribution approved',
  'experiment checkpoint verified',
  'GPU hours credited to contributor',
];

/** Terminal-style activity feed. Seeds from the clock; new entries fade in. */
export default function ActivityFeed({ limit = 7 }: { limit?: number }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const make = (offsetMs: number): Entry => {
      const d = new Date(Date.now() - offsetMs);
      return {
        time: d.toISOString().slice(11, 19),
        text: POOL[Math.floor(Math.random() * POOL.length)],
      };
    };
    setEntries(Array.from({ length: limit }, (_, i) => make((limit - i) * 97000)));
    const t = setInterval(() => {
      setEntries((prev) => [...prev.slice(-(limit - 1)), make(0)]);
    }, 8000);
    return () => clearInterval(t);
  }, [limit]);

  return (
    <div aria-live="polite">
      <div className="mono-label mb-5">NETWORK ACTIVITY</div>
      <div className="space-y-0 font-mono text-xs">
        {entries.map((e, i) => (
          <div
            key={`${e.time}-${i}`}
            className={`flex gap-4 border-b border-[#161a1e]/60 py-2.5 ${
              i === entries.length - 1 ? 'fade-in' : ''
            }`}
          >
            <span className="shrink-0 text-[#555b61]">{e.time}</span>
            <span className="text-[#8c9197]">{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
