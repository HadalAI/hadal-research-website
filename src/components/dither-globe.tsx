'use client';

import { useEffect, useRef } from 'react';
import { GLOBE_DATA } from '@/lib/globe-data';

/**
 * 1-bit ordered-dither globe.
 *
 * A 5.7k-point landmass is projected orthographically, bucketed onto a 3 px cell
 * grid, and each cell is lit only when its coverage beats a 4×4 Bayer threshold —
 * the same trick a halftone print uses, done live. No WebGL, no texture, no deps.
 */

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

type Land = { x: number; y: number; z: number };

function toSphere(lonDeg: number, latDeg: number): Land {
  const lon = (lonDeg * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180;
  const cl = Math.cos(lat);
  return { x: cl * Math.cos(lon), y: Math.sin(lat), z: cl * Math.sin(lon) };
}

export default function DitherGlobe({ size = 520 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drag = useRef({ active: false, lastX: 0, lastY: 0 });
  const motion = useRef({ yaw: -0.6, pitch: 0.32, vy: 0.0, vp: 0.0 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const cell = 3;
    let cssSize = size;

    const points = (GLOBE_DATA.l as [number, number][]).map(([lon, lat]) => toSphere(lon, lat));

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let cols = 0;
    let rows = 0;
    let counts: Float32Array = new Float32Array(0);
    let shadeSum: Float32Array = new Float32Array(0);

    const resize = () => {
      const host = canvas.parentElement;
      const hostW = host ? host.clientWidth : 0;
      cssSize = Math.min(hostW || size, size);
      canvas.width = Math.round(cssSize * dpr);
      canvas.height = Math.round(cssSize * dpr);
      canvas.style.width = `${cssSize}px`;
      canvas.style.height = `${cssSize}px`;
      cols = Math.ceil(cssSize / cell) + 1;
      rows = cols;
      counts = new Float32Array(cols * rows);
      shadeSum = new Float32Array(cols * rows);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      const m = motion.current;

      if (!reduced && !drag.current.active) {
        m.yaw += 0.0016 + m.vy;
        m.pitch += m.vp;
        m.vy *= 0.94;
        m.vp *= 0.9;
      }
      m.pitch = Math.max(-0.62, Math.min(0.62, m.pitch));

      const s = cssSize;
      const cx = s / 2;
      const cy = s / 2;
      const R = s * 0.42;
      const cosY = Math.cos(m.yaw);
      const sinY = Math.sin(m.yaw);
      const cosP = Math.cos(m.pitch);
      const sinP = Math.sin(m.pitch);
      const sweep = reduced ? 0 : (t * 0.00035) % (Math.PI * 2);

      /** radar-like brightening along the sweep arm */
      const sweepBoost = (gx: number, gy: number) => {
        if (reduced) return 0;
        const ang = Math.atan2(gy * cell - cy, gx * cell - cx);
        let d = Math.abs(ang - sweep);
        if (d > Math.PI) d = Math.PI * 2 - d;
        return d < 0.26 ? (1 - d / 0.26) * 0.65 : 0;
      };

      counts.fill(0);
      shadeSum.fill(0);
      let maxCount = 1;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // yaw about Y, then pitch about X
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosP - z1 * sinP;
        const z2 = p.y * sinP + z1 * cosP;

        if (z2 < -0.08) continue; // far hemisphere

        const sx = cx + R * x1;
        const sy = cy - R * y2;
        const gx = Math.floor(sx / cell);
        const gy = Math.floor(sy / cell);
        if (gx < 1 || gy < 1 || gx >= cols - 1 || gy >= rows - 1) continue;

        const shade = 0.42 + 0.58 * ((z2 + 1) / 2);
        const idx = gy * cols + gx;

        // splat a small kernel so landmasses read as tone, not isolated dots
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const w = Math.exp(-(ox * ox + oy * oy) / 1.6);
            const j = idx + oy * cols + ox;
            counts[j] += w;
            shadeSum[j] += w * shade;
          }
        }
        if (counts[idx] > maxCount) maxCount = counts[idx];
      }

      ctx.clearRect(0, 0, s, s);

      // knock the graph-paper backdrop back behind the sphere
      ctx.beginPath();
      ctx.arc(cx, cy, R + 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(3,4,5,0.82)';
      ctx.fill();

      // sonar wedge under the landmass
      if (!reduced) {
        const lead = sweep;
        const grad = ctx.createLinearGradient(
          cx,
          cy,
          cx + Math.cos(lead) * R,
          cy + Math.sin(lead) * R,
        );
        grad.addColorStop(0, 'rgba(122,167,192,0)');
        grad.addColorStop(0.75, 'rgba(122,167,192,0.10)');
        grad.addColorStop(1, 'rgba(190,220,235,0.34)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(lead) * R, cy + Math.sin(lead) * R);
        ctx.stroke();
      }

      // instrument rim
      ctx.beginPath();
      ctx.arc(cx, cy, R + 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // cardinal ticks, sitting on the rim like a bezel
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      for (let k = 0; k < 4; k++) {
        const a = (k * Math.PI) / 2;
        const r0 = R + 1.5;
        const r1 = R + 6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
        ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.stroke();
      }

      // dithered landmass
      const maxLog = Math.log(1 + maxCount);
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const idx = gy * cols + gx;
          const c = counts[idx];
          if (!c) continue;

          const coverage = Math.log(1 + c) / maxLog;
          const shade = shadeSum[idx] / c;
          const level = coverage * shade; // 0..1
          const threshold = (BAYER[gy & 3][gx & 3] + 0.5) / 16;

          if (level <= threshold * 0.72) continue;

          const alpha = Math.min(1, 0.4 + level * 0.9 + sweepBoost(gx, gy));

          ctx.fillStyle =
            level > 0.66 ? `rgba(214,232,242,${alpha})` : `rgba(111,159,184,${alpha})`;
          const px = Math.round(gx * cell);
          const py = Math.round(gy * cell);
          ctx.fillRect(px, py, cell - 0.6, cell - 0.6);
        }
      }

      // coastline pass: cells with open sea beside them are drawn solid, so the
      // silhouettes stay legible even where the dither thins out
      for (let gy = 1; gy < rows - 1; gy++) {
        for (let gx = 1; gx < cols - 1; gx++) {
          const idx = gy * cols + gx;
          if (counts[idx] < 0.5) continue;
          const openSea =
            counts[idx - 1] < 0.05 ||
            counts[idx + 1] < 0.05 ||
            counts[idx - cols] < 0.05 ||
            counts[idx + cols] < 0.05;
          if (!openSea) continue;
          ctx.fillStyle = 'rgba(198,222,234,0.78)';
          ctx.fillRect(Math.round(gx * cell), Math.round(gy * cell), cell - 0.6, cell - 0.6);
        }
      }
    };

    raf = requestAnimationFrame(draw);
    if (typeof window !== 'undefined') window.addEventListener('resize', resize);

    const onDown = (e: PointerEvent) => {
      drag.current = { active: true, lastX: e.clientX, lastY: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      const dy = e.clientY - drag.current.lastY;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      const m = motion.current;
      m.yaw += dx * 0.006;
      m.pitch += dy * 0.005;
      m.vy = dx * 0.0012;
      m.vp = dy * 0.0009;
    };
    const onUp = () => {
      drag.current.active = false;
      canvas.style.cursor = 'grab';
    };

    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, [size]);

  return <canvas ref={ref} aria-hidden="true" className="mx-auto block" />;
}
