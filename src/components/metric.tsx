'use client';

import { useEffect, useRef, useState } from 'react';

/** Counts up to `value` once when it enters the viewport. Respects reduced motion. */
export function useCountUp(value: number, duration = 900) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || value === 0) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el || started.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(value * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return { ref, display };
}

export function Metric({
  label,
  value,
  suffix,
  format = true,
}: {
  label: string;
  value: number;
  suffix?: string;
  format?: boolean;
}) {
  const { ref, display } = useCountUp(value);
  return (
    <div>
      <div className="mono-label mb-3">{label}</div>
      <span ref={ref} className="tabular text-2xl font-medium text-[#f5f5f2] md:text-3xl">
        {format ? display.toLocaleString() : display}
        {suffix ? <span className="text-[#8c9197]">{suffix}</span> : null}
      </span>
    </div>
  );
}
