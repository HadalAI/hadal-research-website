'use client';

import { useState } from 'react';

export default function CopyCitation({ bibtex }: { bibtex: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bibtex);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.setTimeout(() => setState('idle'), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="btn btn-ghost !rounded-lg"
      aria-live="polite"
    >
      {state === 'copied' ? 'Copied ✓' : state === 'failed' ? 'Copy failed' : 'Cite'}
    </button>
  );
}
