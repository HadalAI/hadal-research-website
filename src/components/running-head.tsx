'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { MAX_DEPTH, depthFor, depthMode, metres } from '@/lib/depth-store';

const SECTIONS: Record<string, { n: string; label: string }> = {
  '/': { n: '00', label: 'Cover' },
  '/research': { n: '01', label: 'Research' },
  '/publications': { n: '02', label: 'Publications' },
  '/blog': { n: '03', label: 'Notes' },
  '/models': { n: '04', label: 'Models' },
  '/compute': { n: '05', label: 'Compute' },
  '/privacy': { n: '—', label: 'Privacy' },
  '/terms': { n: '—', label: 'Terms' },
};

/** Running head: section, and how far through the sheet you are. */
export default function RunningHead() {
  const pathname = usePathname();
  const sounding = useSyncExternalStore(depthMode.sub, depthMode.get, () => false);
  const [pct, setPct] = useState(0);
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = document.scrollingElement;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100);
      setDepth(depthFor(el.scrollTop, el.scrollHeight, el.clientHeight));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const key = pathname.startsWith('/blog/') ? '/blog' : pathname.replace(/\/$/, '') || '/';
  const section = SECTIONS[key] ?? { n: '—', label: 'Hadal' };

  return (
    <p className="mono-label tabular hidden sm:flex items-baseline gap-2 text-muted">
      <span className="text-accent">§</span>
      <span className="text-ink">{section.n}</span>
      <span>{section.label}</span>
      <span className="text-rule">·</span>
      <span className="text-ink">
        {sounding ? metres(Math.round((depth / MAX_DEPTH) * MAX_DEPTH)) : `${pct}%`}
      </span>
    </p>
  );
}
