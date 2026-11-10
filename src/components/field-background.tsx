'use client';

import { useEffect, useRef } from 'react';

/**
 * Interactive field: a hairline mesh across the page that bends away from the
 * pointer and drifts on its own. Sits behind the content at very low contrast —
 * the page behaves like a plate under load rather than a flat background.
 */
export default function FieldBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const SPACING = 46;
    const RADIUS = 190;
    const PUSH = 30;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let px = -9999;
    let py = -9999;
    let tx = -9999;
    let ty = -9999;
    let raf = 0;
    let last = 0;

    const xs = { current: new Float32Array(0) };
    const ys = { current: new Float32Array(0) };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / SPACING) + 1;
      rows = Math.ceil(h / SPACING) + 1;
      xs.current = new Float32Array(cols * rows);
      ys.current = new Float32Array(cols * rows);
    };
    resize();

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 28) return; // ~35 fps is plenty for a background
      last = t;

      // pointer eases toward its target so the field settles instead of snapping
      px += (tx - px) * 0.18;
      py += (ty - py) * 0.18;

      ctx.clearRect(0, 0, w, h);
      const X = xs.current;
      const Y = ys.current;

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const bx = gx * SPACING;
          const by = gy * SPACING;
          let dx = 0;
          let dy = 0;
          if (!reduced) {
            const vx = bx - px;
            const vy = by - py;
            const d2 = vx * vx + vy * vy;
            const d = Math.sqrt(d2) || 1;
            const falloff = Math.exp(-d2 / (2 * RADIUS * RADIUS));
            const push = falloff * PUSH;
            dx = (vx / d) * push + Math.sin(t * 0.0004 + gx * 0.55) * 1.6;
            dy = (vy / d) * push + Math.cos(t * 0.0005 + gy * 0.5) * 1.6;
          }
          const i = gy * cols + gx;
          X[i] = bx + dx;
          Y[i] = by + dy;
        }
      }

      // mesh: one batched pass at baseline alpha, then per-edge emphasis only in
      // the pointer neighbourhood (bounded, so the frame stays cheap)
      ctx.lineWidth = 1;
      const base = new Path2D();
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = gy * cols + gx;
          if (gx + 1 < cols) {
            base.moveTo(X[i], Y[i]);
            base.lineTo(X[i + 1], Y[i + 1]);
          }
          if (gy + 1 < rows) {
            base.moveTo(X[i], Y[i]);
            base.lineTo(X[i + cols], Y[i + cols]);
          }
        }
      }
      ctx.strokeStyle = 'rgba(122,167,192,0.055)';
      ctx.stroke(base);

      const hotR2 = (RADIUS * 1.2) ** 2;
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = gy * cols + gx;
          const d2 = (X[i] - px) ** 2 + (Y[i] - py) ** 2;
          if (d2 > hotR2) continue;
          const near = 1 - d2 / hotR2;
          ctx.strokeStyle = `rgba(122,167,192,${0.05 + near * 0.18})`;
          ctx.beginPath();
          if (gx + 1 < cols) {
            ctx.moveTo(X[i], Y[i]);
            ctx.lineTo(X[i + 1], Y[i + 1]);
          }
          if (gy + 1 < rows) {
            ctx.moveTo(X[i], Y[i]);
            ctx.lineTo(X[i + cols], Y[i + cols]);
          }
          ctx.stroke();
        }
      }

      // node marks, brighter the closer the pointer
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = gy * cols + gx;
          const near = Math.exp(
            -((X[i] - px) ** 2 + (Y[i] - py) ** 2) / (2 * (RADIUS * 0.85) ** 2),
          );
          if (near < 0.02) continue;
          ctx.fillStyle = `rgba(198,222,234,${0.10 + near * 0.65})`;
          ctx.fillRect(X[i], Y[i], 1.6, 1.6);
        }
      }
    };

    raf = requestAnimationFrame(draw);
    draw(performance.now()); // paint once immediately; rAF can be throttled
    window.addEventListener('resize', resize);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onLeave = () => {
      tx = -9999;
      ty = -9999;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden opacity-90 sm:block"
    />
  );
}
