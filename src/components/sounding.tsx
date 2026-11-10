'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { CHALLENGER, MAX_DEPTH, depthFor, depthMode, metres } from '@/lib/depth-store';

type Note = { text: string; sub: string };

/**
 * No labels, no hints, no menu. Three things can happen to someone who is
 * poking around: press d, type a word, or click the masthead three times.
 */
export default function Sounding() {
  const on = useSyncExternalStore(depthMode.sub, depthMode.get, () => false);
  const [note, setNote] = useState<Note | null>(null);
  const [depth, setDepth] = useState(0);
  const timer = useRef<number | null>(null);
  const buffer = useRef('');

  useEffect(() => {
    const show = (text: string, sub: string) => {
      setNote({ text, sub });
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setNote(null), 7000);
    };

    const typing = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      if (!node) return false;
      return (
        node.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(node.tagName) ||
        !!node.closest('input, textarea, select, [contenteditable="true"]')
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (typing(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key.length === 1) {
        buffer.current = (buffer.current + e.key.toLowerCase()).slice(-24);
        if (buffer.current.endsWith('challenger')) {
          buffer.current = '';
          depthMode.set(true);
          document.dispatchEvent(new CustomEvent('hadal:challenger'));
          show('SOUNDING', `11°21′N 142°12′E · ${metres(MAX_DEPTH)}`);
          return;
        }
      }

      if (e.key === 'd' || e.key === 'D') {
        depthMode.toggle();
        show(depthMode.get() ? 'SOUNDING' : 'SURFACE', depthMode.get() ? 'depth in metres, right rail' : 'percent of sheet');
      }
    };

    // three clicks on the masthead label, inside 1200 ms
    let clicks: number[] = [];
    const onWordmark = (e: Event) => {
      const el = (e.target as HTMLElement).closest('#imprint-mark');
      if (!el) return;
      const now = performance.now();
      clicks = [...clicks.filter((t) => now - t < 1200), now];
      if (clicks.length >= 3) {
        clicks = [];
        show('COLOPHON', 'Set in IBM Plex · printed at 10,911 m');
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onWordmark, true);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onWordmark, true);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = document.scrollingElement;
      if (!el) return;
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
  }, [on]);

  return (
    <>
      {on && (
        <div aria-hidden="true" className="pointer-events-none fixed right-0 top-0 z-20 hidden h-full w-12 md:block">
          <div className="relative h-full border-l border-rule/70">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-0 h-px bg-rule"
                style={{ top: `${(i / 11) * 100}%`, width: i % 5 === 0 ? '10px' : '5px' }}
              />
            ))}
            <span
              className="absolute -left-px flex items-center gap-1 transition-[top] duration-150"
              style={{ top: `${(depth / MAX_DEPTH) * 100}%` }}
            >
              <span className="block h-px w-5 bg-accent" />
              <span className="mono-label tabular relative top-[-0.45rem] bg-paper pr-1 text-[9.5px] text-accent">
                {metres(depth)}
              </span>
            </span>
          </div>
        </div>
      )}

      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-3 left-3 z-50 border border-rule bg-paper-2 px-2.5 py-1.5 transition-opacity duration-300 sm:left-4 ${
          note ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="mono-label block text-[9.5px] text-accent">{note?.text ?? ''}</span>
        <span className="mono-label block text-[10px] text-ink">{note?.sub ?? ''}</span>
      </div>
    </>
  );
}

export { CHALLENGER };
