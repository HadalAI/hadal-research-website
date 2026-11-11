'use client';

import { useEffect, useRef } from 'react';

type Mark = { x: number; y: number; t: number };

/**
 * A plotter crosshair for the margins: it appears only over empty paper — never
 * over text or controls — and a click leaves a registration mark that fades.
 * Reads as instrument furniture rather than a custom cursor.
 */
export default function PointerLayer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const marks: Mark[] = [];
    let w = 0;
    let h = 0;
    let x = -999;
    let y = -999;
    let live = false;
    let raf = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const isPaper = (el: Element | null) =>
      !el ||
      !el.closest(
        'p, h1, h2, h3, h4, h5, h6, a, button, li, td, th, code, pre, blockquote, label, input, textarea, select, canvas, figcaption',
      );

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);

      if (live) {
        ctx.strokeStyle = 'rgba(23,23,26,0.38)';
        ctx.lineWidth = 1;
        const g = 9;
        for (const [ax, ay, bx, by] of [
          [x - g - 5, y, x - g, y],
          [x + g, y, x + g + 5, y],
          [x, y - g - 5, x, y - g],
          [x, y + g, x, y + g + 5],
        ]) {
          ctx.beginPath();
          ctx.moveTo(ax + 0.5, ay + 0.5);
          ctx.lineTo(bx + 0.5, by + 0.5);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(138,51,36,0.9)';
        ctx.fillRect(x - 0.5, y - 0.5, 1.5, 1.5);
      }

      for (let i = marks.length - 1; i >= 0; i--) {
        const m = marks[i];
        const age = (t - m.t) / 1000;
        if (age > 1.4) {
          marks.splice(i, 1);
          continue;
        }
        const fade = 1 - age / 1.4;
        ctx.strokeStyle = `rgba(138,51,36,${0.5 * fade})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 4 + age * 26, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(138,51,36,${0.55 * fade})`;
        ctx.fillRect(m.x - 1, m.y - 1, 2, 2);
      }
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    let hx = -999;
    let hy = -999;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // hit-testing forces a layout read; skip it when the pointer barely moved
      if (Math.abs(x - hx) + Math.abs(y - hy) < 4) return;
      hx = x;
      hy = y;
      live = isPaper(document.elementFromPoint(x, y));
    };
    const onLeave = () => {
      live = false;
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      if (!isPaper(document.elementFromPoint(e.clientX, e.clientY))) return;
      marks.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (marks.length > 6) marks.shift();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45]" />;
}
