'use client';

import { useEffect, useRef } from 'react';
import { GLOBE_DATA } from '@/lib/globe-data';

/**
 * Point-cloud Earth: land dots from Natural Earth data (precomputed
 * coordinates), sparse ocean sparkles, atmospheric rim glow, animated
 * network arcs between hub cities, slow Y spin with northern tilt.
 */
type V3 = { x: number; y: number; z: number };

function toSph(lat: number, lon: number): V3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const th = ((lon + 180) * Math.PI) / 180;
  return {
    x: Math.sin(phi) * Math.cos(th),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(th),
  };
}

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

    // --- static geometry, built once ---
    const landV = GLOBE_DATA.l.map(([lon, lat]) => ({
      v: toSph(lat, lon),
      sz: 0.7 + Math.random() * 0.5,
      bright: false as boolean,
    }));
    // ~5% of land dots flare brighter
    for (let i = 0; i < landV.length; i += 20) landV[i].bright = true;

    // ocean sparkles: random unit-sphere points (not land-checked — they render dim)
    const oceanV: { v: V3; sz: number }[] = [];
    let guard = 0;
    while (oceanV.length < 240 && guard++ < 4000) {
      const v: V3 = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1,
      };
      const len = Math.hypot(v.x, v.y, v.z);
      if (len < 0.1 || len > 1) continue;
      v.x /= len; v.y /= len; v.z /= len;
      oceanV.push({ v, sz: 0.4 + Math.random() * 0.4 });
    }

    const hubs: V3[] = GLOBE_DATA.h.map(([la, lo]) => toSph(la, lo));

    let raf = 0;
    let rotY = 0;
    const TILT = -0.35; // lean back to show the northern hemisphere

    const draw = () => {
      const s = Math.min(canvas.offsetWidth, size);
      const cx = s / 2;
      const cy = s / 2;
      const R = s / 2 - 10;
      ctx.clearRect(0, 0, s, s);

      const sinT = Math.sin(TILT), cosT = Math.cos(TILT);
      const sinY = Math.sin(rotY), cosY = Math.cos(rotY);
      const project = (v: V3) => {
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;
        const y2 = v.y * cosT - z1 * sinT;
        const z2 = v.y * sinT + z1 * cosT;
        return { px: cx + x1 * R, py: cy - y2 * R, z: z2 };
      };

      // --- atmosphere rim glow ---
      const grad = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
      grad.addColorStop(0, 'rgba(56,189,248,0.30)');
      grad.addColorStop(0.45, 'rgba(56,189,248,0.10)');
      grad.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.25, 0, 7);
      ctx.fill();

      // sphere fill so back-side dots don't bleed through
      ctx.fillStyle = 'rgba(7,10,15,0.6)';
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 7);
      ctx.fill();

      // --- ocean sparkles (dim) ---
      for (const p of oceanV) {
        const pr = project(p.v);
        if (pr.z <= 0.02) continue;
        ctx.fillStyle = `rgba(70,110,150,${0.05 + pr.z * 0.18})`;
        ctx.beginPath();
        ctx.arc(pr.px, pr.py, p.sz, 0, 7);
        ctx.fill();
      }

      // --- land dots ---
      for (const p of landV) {
        const pr = project(p.v);
        if (pr.z <= 0.02) continue;
        const a = 0.12 + pr.z * 0.65;
        ctx.fillStyle = p.bright ? `rgba(147,197,253,${a})` : `rgba(56,149,232,${a})`;
        ctx.beginPath();
        ctx.arc(pr.px, pr.py, p.sz + pr.z * 0.5, 0, 7);
        ctx.fill();
      }

      // --- hub nodes + network arcs between visible hubs ---
      type Proj = ReturnType<typeof project>;
      const hp: (Proj | null)[] = hubs.map(project);
      for (let i = 0; i < hp.length; i++) {
        if (!hp[i] || hp[i]!.z <= 0.05) continue;
        for (let j = i + 1; j < hp.length; j++) {
          if (!hp[j] || hp[j]!.z <= 0.05) continue;
          const a = hp[i]!, b = hp[j]!;
          const mx = (a.px + b.px) / 2;
          const my = (a.py + b.py) / 2;
          // lift midpoint off the sphere toward the viewer
          const dx = mx - cx, dy = my - cy;
          const dl = Math.hypot(dx, dy) || 1;
          const lift = R * (0.18 + 0.22 * (1 - dl / R));
          const qx = mx + (dx / dl) * lift;
          const qy = my + (dy / dl) * lift;
          const t = (Math.sin(performance.now() / 900 + i + j) + 1) / 2; // pulse phase
          ctx.strokeStyle = `rgba(125,211,252,${0.05 + t * 0.13})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.quadraticCurveTo(qx, qy, b.px, b.py);
          ctx.stroke();
        }
      }
      // bright hub points on top of arcs
      for (const h of hp) {
        if (!h || h.z <= 0.05) continue;
        ctx.fillStyle = `rgba(186,230,253,${0.4 + h.z * 0.55})`;
        ctx.beginPath();
        ctx.arc(h.px, h.py, 1.8, 0, 7);
        ctx.fill();
      }

      if (!reduced) {
        rotY += 0.0016;
        raf = requestAnimationFrame(draw);
      }
    };
    draw();

    const onResize = () => draw();
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
