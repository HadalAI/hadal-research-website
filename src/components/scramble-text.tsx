'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '▚▞░▒▓│─┼<>/\\01ABCDEF#*';

/** Mono label that resolves out of noise when the pointer crosses it. */
export default function ScrambleText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [out, setOut] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const run = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (timer.current) clearInterval(timer.current);
    frame.current = 0;
    timer.current = setInterval(() => {
      frame.current += 1;
      const revealed = Math.floor((frame.current / 11) * text.length);
      setOut(
        text
          .split('')
          .map((c, i) =>
            i < revealed || c === ' ' || c === '/' || c === '·'
              ? c
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      );
      if (frame.current >= 11) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setOut(text);
      }
    }, 26);
  };

  return (
    <span className={className} onMouseEnter={run} onFocus={run}>
      {out}
    </span>
  );
}
