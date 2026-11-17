'use client';

import { useId, useState } from 'react';

const TERMS: Record<string, string> = {
  ci: 'Confidence interval. Here: Newcombe method 10 for paired proportions, computed from the 2×2 counts of each cell — not from a bootstrap.',
  mcnemar: 'Exact McNemar test: the paired-binary test of whether the two wordings differ across items, using only the discordant pairs.',
  pp: 'Percentage points — an absolute difference between two percentages, not a relative change.',
  headroom: 'A cell is marked “no headroom” when the forward wording already scores below 15%: there is nothing for the backward wording to lose, so the cell is not evidence either way.',
  margin: 'The practical margin — ±15 points — was fixed before the midpoint runs. An interval can exclude zero (a real effect) and still fail to clear it (a large effect).',
  prespecified:
    'Fixed before the data existed. The paper separates what was pre-specified from what was chosen after seeing results.',
  bayer: 'Bayer matrix: a fixed grid of thresholds that turns a continuous tone into a regular dot screen. The pattern you are looking at.',
};

export default function Term({ k, children }: { k: keyof typeof TERMS; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="cursor-help border-b border-dotted border-accent/60 text-ink transition-colors hover:text-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
      >
        {children}
      </button>
      {open && (
        <span
          id={id}
          role="note"
          className="fixed bottom-3 left-1/2 z-50 block w-[min(30rem,calc(100vw-1.5rem))] -translate-x-1/2 border border-rule bg-paper-2 px-3 py-2 text-left font-serif text-[13px] leading-snug text-ink shadow-[2px_2px_0_rgba(23,23,26,0.08)]"
        >
          <span className="mono-label mb-1 block text-[10px]">Note · footnote</span>
          {TERMS[k]}
        </span>
      )}
    </span>
  );
}
