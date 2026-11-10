'use client';

import { useState } from 'react';

/** Click a figure to take it with you. */
export default function CopyValue({
  value,
  copy,
  className,
  hint = 'Copy',
}: {
  value: string;
  copy: string;
  className?: string;
  hint?: string;
}) {
  const [done, setDone] = useState(false);

  const run = async () => {
    try {
      await navigator.clipboard.writeText(copy);
      setDone(true);
    } catch {
      setDone(false);
    }
    window.setTimeout(() => setDone(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={run}
      title={`${hint} — ${copy}`}
      className={`group relative text-left ${className ?? ''}`}
      aria-live="polite"
    >
      {value}
      <span
        aria-hidden="true"
        className={`mono-label absolute -bottom-5 left-0 whitespace-nowrap text-[9.5px] transition-opacity duration-200 ${
          done ? 'text-accent opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {done ? 'Copied ✓' : hint}
      </span>
    </button>
  );
}
