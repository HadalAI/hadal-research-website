'use client';

import { useEffect, useRef } from 'react';

type Ripple = { x: number; y: number; t: number };

/**
 * The page behaves like a surface under load.
 *
 * A hairline mesh exists under the cursor only: the lattice is twisted around
 * the pointer like an eddy, and nowhere else, so the page stays clean instead of
 * wearing a decorative grid. Clicking sends a pulse outward through the mesh.
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

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let spacing = 46;
    let px = -9999;
    let py = -9999;
    let tx = -9999;
    let ty = -9999;
    let raf = 0;
    let last = 0;

    const RADIUS = 175;
    const R2 = RADIUS * RADIUS;
    const TWIST = 0.22;
    const ripples: Ripple[] = [];

    let X = new Float32Array(0);
    let Y = new Float32Array(0);
    let mag = new Float32Array(0);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      spacing = w < 640 ? 48 : 34;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / spacing) + 1;
      rows = Math.ceil(h / spacing) + 1;
      X = new Float32Array(cols * rows);
      Y = new Float32Array(cols * rows);
      mag = new Float32Array(cols * rows);
    };
    resize();

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 26) return;
      last = t;

      px += (tx - px) * 0.2;
      py += (ty - py) * 0.2;
      const pointerLive = px > -5000;

      while (ripples.length && t - ripples[0].t > 2600) ripples.shift();

      ctx.clearRect(0, 0, w, h);
      if (reduced || (!pointerLive && ripples.length === 0)) return;

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = gy * cols + gx;
          const bx = gx * spacing;
          const by = gy * spacing;
          let dx = 0;
          let dy = 0;
          let n = 0;

          if (pointerLive) {
            // a swirl, not a push: rotating the lattice has zero displacement at
            // the centre and decays smoothly outward, so there is no pinch point
            const vx = bx - px;
            const vy = by - py;
            const d2 = vx * vx + vy * vy;
            n = Math.exp(-d2 / (2 * R2));
            if (n > 0.004) {
              const ang = n * TWIST;
              const c = Math.cos(ang);
              const s = Math.sin(ang);
              dx += c * vx - s * vy - vx;
              dy += s * vx + c * vy - vy;
            }
          }

          for (let k = 0; k < ripples.length; k++) {
            const rp = ripples[k];
            const age = (t - rp.t) / 1000;
            const radius = age * 430;
            const decay = Math.exp(-age * 1.05);
            if (decay < 0.02) continue;
            const vx = bx - rp.x;
            const vy = by - rp.y;
            const d = Math.sqrt(vx * vx + vy * vy) || 1;
            const band = Math.exp(-((d - radius) ** 2) / (2 * 62 * 62));
            const amp = band * decay * 20;
            if (amp < 0.05) continue;
            dx += (vx / d) * amp;
            dy += (vy / d) * amp;
            if (n < band * decay) n = band * decay;
          }

          X[i] = bx + dx + Math.sin(t * 0.0005 + gx * 0.7) * 1.1 * n;
          Y[i] = by + dy + Math.cos(t * 0.0006 + gy * 0.6) * 1.1 * n;
          mag[i] = Math.sqrt(dx * dx + dy * dy);
        }
      }

      // lines exist only where the mesh is actually displaced, so there is no
      // hard patch boundary — the grid emerges out of the distortion. Alpha is
      // bucketed into a few batched paths so the whole mesh costs six strokes.
      const BUCKETS = 6;
      const MAX_A = 0.44;
      const paths: Path2D[] = [];
      for (let b = 0; b < BUCKETS; b++) paths.push(new Path2D());

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = gy * cols + gx;
          const a = Math.min(MAX_A, (mag[i] / 13) * MAX_A);
          if (a < 0.05) continue;
          const path = paths[Math.min(BUCKETS - 1, Math.floor((a / MAX_A) * BUCKETS))];
          if (gx + 1 < cols) {
            path.moveTo(X[i], Y[i]);
            path.lineTo(X[i + 1], Y[i + 1]);
          }
          if (gy + 1 < rows) {
            path.moveTo(X[i], Y[i]);
            path.lineTo(X[i + cols], Y[i + cols]);
          }
        }
      }
      ctx.lineWidth = 1;
      for (let b = 0; b < BUCKETS; b++) {
        ctx.strokeStyle = `rgba(122,167,192,${(((b + 0.5) / BUCKETS) * MAX_A).toFixed(3)})`;
        ctx.stroke(paths[b]);
      }

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = gy * cols + gx;
          const a = Math.min(0.62, (mag[i] / 12) * 0.62);
          if (a < 0.08) continue;
          ctx.fillStyle = `rgba(198,222,234,${a})`;
          ctx.fillRect(X[i], Y[i], 1.6, 1.6);
        }
      }

      for (const rp of ripples) {
        const age = (t - rp.t) / 1000;
        const radius = age * 430;
        const decay = Math.exp(-age * 1.05);
        if (decay < 0.03 || radius > Math.hypot(w, h)) continue;
        ctx.strokeStyle = `rgba(122,167,192,${decay * 0.32})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    raf = requestAnimationFrame(draw);
    draw(performance.now()); // first paint; rAF is throttled in background tabs
    window.addEventListener('resize', resize);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onLeave = () => {
      tx = -9999;
      ty = -9999;
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (ripples.length > 4) ripples.shift();
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

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
