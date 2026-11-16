'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Doodle } from '@/components/doodles';

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

/** Running head: which sheet you are on, and how far down the page you have read. */
export default function RunningHead() {
  const pathname = usePathname();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = document.scrollingElement;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100);
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
    <p className="mono-label flex items-center gap-2.5">
      <span className="text-marker">§</span>
      <span className="tabular">{section.n}</span>
      <span>{section.label}</span>
      <span className="text-pencil">
        <span className="lowercase tracking-normal">read</span>{' '}
        <span className="tabular">{pct}%</span>
      </span>

      {/* the pencil travels along the line as you read */}
      <span className="relative hidden h-5 w-28 items-center sm:flex" aria-hidden="true">
        <svg
          viewBox="0 0 120 14"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="h-3 w-full text-ink/45"
        >
          <path d="M2 9c18-3.6 36-4.4 54-2.4 18 2 36 2.2 54 0" />
        </svg>
        <span
          className="absolute top-0 h-4 w-4 text-marker"
          style={{ left: `calc(${pct}% - 0.5rem)` }}
        >
          <Doodle name="pencil" className="h-4 w-4" strokeWidth={3.2} />
        </span>
      </span>
    </p>
  );
}
