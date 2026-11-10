'use client';

import { useEffect, useRef } from 'react';
import { GLOBE_DATA } from '@/lib/globe-data';

/**
 * Plate I. The landmask is projected orthographically, splatted onto a 4 px cell
 * grid and printed through a 4×4 Bayer threshold — a halftone plate rather than a
 * 3D globe. Ink only, no glow, no WebGL. Drag to turn it.
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

export default function DitherGlobe({ size = 420 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drag = useRef({ active: false, lastX: 0, lastY: 0 });
  const motion = useRef({ yaw: -0.55, pitch: 0.3, vy: 0, vp: 0 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cell = 4;
    const points = (GLOBE_DATA.l as [number, number][]).map(([lon, lat]) => toSphere(lon, lat));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let css = size;
    let cols = 0;
    let rows = 0;
    let counts = new Float32Array(0);
    let shade = new Float32Array(0);

    const resize = () => {
      const host = canvas.parentElement;
      let avail = size;
      if (host) {
        const cs = getComputedStyle(host);
        avail =
          host.clientWidth - parseFloat(cs.paddingLeft || '0') - parseFloat(cs.paddingRight || '0');
      }
      css = Math.max(160, Math.min(avail || size, size));
      canvas.width = Math.round(css * dpr);
      canvas.height = Math.round(css * dpr);
      canvas.style.width = `${css}px`;
      canvas.style.height = `${css}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(css / cell) + 1;
      rows = cols;
      counts = new Float32Array(cols * rows);
      shade = new Float32Array(cols * rows);
    };
    resize();

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      const m = motion.current;
      if (!reduced && !drag.current.active) {
        m.yaw += 0.0011 + m.vy;
        m.pitch += m.vp;
        m.vy *= 0.94;
        m.vp *= 0.9;
      }
      m.pitch = Math.max(-0.6, Math.min(0.6, m.pitch));

      const s = css;
      const cx = s / 2;
      const cy = s / 2;
      const R = s * 0.43;
      const cosY = Math.cos(m.yaw);
      const sinY = Math.sin(m.yaw);
      const cosP = Math.cos(m.pitch);
      const sinP = Math.sin(m.pitch);

      counts.fill(0);
      shade.fill(0);
      let max = 1;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosP - z1 * sinP;
        const z2 = p.y * sinP + z1 * cosP;
        if (z2 < -0.06) continue;

        const gx = Math.floor((cx + R * x1) / cell);
        const gy = Math.floor((cy - R * y2) / cell);
        if (gx < 1 || gy < 1 || gx >= cols - 1 || gy >= rows - 1) continue;

        const depth = 0.34 + 0.66 * ((z2 + 1) / 2);
        const idx = gy * cols + gx;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const w = Math.exp(-(ox * ox + oy * oy) / 1.6);
            const j = idx + oy * cols + ox;
            counts[j] += w;
            shade[j] += w * depth;
          }
        }
        if (counts[idx] > max) max = counts[idx];
      }

      ctx.clearRect(0, 0, s, s);

      // plate frame
      ctx.beginPath();
      ctx.arc(cx, cy, R + 1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(23,23,26,0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const maxLog = Math.log(1 + max);
      for (let gy = 1; gy < rows - 1; gy++) {
        for (let gx = 1; gx < cols - 1; gx++) {
          const idx = gy * cols + gx;
          const c = counts[idx];
          if (c < 0.02) continue;
          const coverage = Math.log(1 + c) / maxLog;
          const level = coverage * (shade[idx] / c);
          const threshold = (BAYER[gy & 3][gx & 3] + 0.5) / 16;
          if (level <= threshold * 0.7) continue;

          const alpha = Math.min(0.92, 0.3 + level * 0.72);
          ctx.fillStyle = `rgba(23,23,26,${alpha})`;
          ctx.fillRect(Math.round(gx * cell), Math.round(gy * cell), cell - 1.2, cell - 1.2);
        }
      }
    };

    raf = requestAnimationFrame(draw);
    draw(performance.now());
    window.addEventListener('resize', resize);

    const down = (e: PointerEvent) => {
      drag.current = { active: true, lastX: e.clientX, lastY: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      const dy = e.clientY - drag.current.lastY;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      const m = motion.current;
      m.yaw += dx * 0.006;
      m.pitch += dy * 0.004;
      m.vy = dx * 0.001;
      m.vp = dy * 0.0008;
    };
    const up = () => {
      drag.current.active = false;
    };

    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
  }, [size]);

  return <canvas ref={ref} aria-hidden="true" className="mx-auto block" />;
}
