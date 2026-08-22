'use client';

import { useEffect, useRef } from 'react';

/**
 * Rotating dotted globe: ~900 points on a sphere (fibonacci lattice),
 * orthographically projected, front hemisphere brighter. Slow Y-axis spin.
 */
export default function GlobeField({ size = 520 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext('2d');
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const s = Math.min(canvas.offsetWidth, size);
      canvas.width = s * dpr;
      canvas.height = s * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const N = 900;
    const GA = Math.PI * (3 - Math.sqrt(5));
    type Pt = { y: number; r: number; th: number; bright: boolean };
    const pts: Pt[] = Array.from({ length: N }, (_, i) => ({
      y: 1 - (2 * (i + 0.5)) / N,
      r: Math.sqrt(Math.max(0, 1 - (1 - (2 * (i + 0.5)) / N) ** 2)),
      th: i * GA,
      bright: Math.random() < 0.07,
    }));

    let raf = 0;
    let lon = 0;

    const draw = (now?: number) => {
      const s = Math.min(canvas.offsetWidth, size);
      const cx = s / 2;
      const cy = s / 2;
      const R = s / 2 - 8;
      ctx.clearRect(0, 0, s, s);
      for (const p of pts) {
        const cosLat = p.r;
        const x = cosLat * Math.sin(p.th + lon);
        const z = cosLat * Math.cos(p.th + lon);
        const y = p.y;
        if (z <= 0.02) continue; // back hemisphere
        const depth = z; // 0..1
        const px = cx + x * R;
        const py = cy - y * R;
        const pr = 0.6 + depth * 1.3 + (p.bright ? 0.5 : 0);
        const alpha = 0.08 + depth * 0.55 + (p.bright ? 0.25 : 0);
        ctx.fillStyle = p.bright
          ? `rgba(150,190,220,${alpha})`
          : `rgba(110,145,180,${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, 7);
        ctx.fill();
      }
      if (!reduced) {
        lon += 0.0022;
        raf = requestAnimationFrame(draw);
      }
    };
    draw(performance.now());
    const onResize = () => draw(performance.now());
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [size]);

  return (
    <canvas
      ref={ref}
      style={{ width: size, height: size, maxWidth: '100%' }}
      aria-hidden="true"
    />
  );
}
