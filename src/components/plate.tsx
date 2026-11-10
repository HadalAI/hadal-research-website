'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GLOBE_DATA } from '@/lib/globe-data';

/**
 * Plate I — a halftone landmass you can handle.
 *
 * The landmask is projected orthographically, splatted onto a 5 px cell grid and
 * printed through an ordered threshold. Hover it to read the coordinate under the
 * pointer; click the caption to change the screen (4×4, 8×8, random) and the plate
 * re-prints itself. Drag to turn it. Ink on paper, no WebGL.
 */

type Cell = [number, number];

function buildBayer(size: number): number[][] {
  let m = [[0]];
  while (m.length < size) {
    const n = m.length;
    const next: number[][] = Array.from({ length: n * 2 }, () => Array(n * 2).fill(0));
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = m[y][x] * 4;
        next[y][x] = v;
        next[y][x + n] = v + 2;
        next[y + n][x] = v + 3;
        next[y + n][x + n] = v + 1;
      }
    }
    m = next;
  }
  return m;
}

const MODES = [
  { id: 'bayer4', label: 'Screen: ordered 4×4', size: 4 },
  { id: 'bayer8', label: 'Screen: ordered 8×8', size: 8 },
  { id: 'noise', label: 'Screen: random', size: 4 },
] as const;

type ModeId = (typeof MODES)[number]['id'];

export default function Plate({ size = 420 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef({ active: false, lastX: 0, lastY: 0, moved: false });
  const motion = useRef({ yaw: -0.55, pitch: 0.3, vy: 0, vp: 0 });
  const hover = useRef<{ x: number; y: number } | null>(null);
  const tilt = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const printStart = useRef(0);
  const [mode, setMode] = useState<ModeId>('bayer4');
  const [coord, setCoord] = useState<string | null>(null);

  const cycle = useCallback(() => {
    setMode((m) => {
      const i = MODES.findIndex((x) => x.id === m);
      return MODES[(i + 1) % MODES.length].id;
    });
    printStart.current = performance.now();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    printStart.current = performance.now();
    const cell = 5;
    const points = (GLOBE_DATA.l as Cell[]).map(([lonDeg, latDeg]) => {
      const lon = (lonDeg * Math.PI) / 180;
      const lat = (latDeg * Math.PI) / 180;
      const cl = Math.cos(lat);
      return { x: cl * Math.cos(lon), y: Math.sin(lat), z: cl * Math.sin(lon) };
    });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spec = MODES.find((m) => m.id === mode) ?? MODES[0];
    const matrix = spec.id === 'noise' ? null : buildBayer(spec.size);
    const levels = spec.size * spec.size;

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

    const R = () => css * 0.43;

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
      const rad = R();

      // the plate leans toward the pointer, so it reads as an object before
      // anyone thinks to drag it
      const tl = tilt.current;
      tl.x += (tl.tx - tl.x) * 0.08;
      tl.y += (tl.ty - tl.y) * 0.08;
      const yaw = m.yaw + tl.x;
      const pitch = Math.max(-0.75, Math.min(0.75, m.pitch + tl.y));

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

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

        const gx = Math.floor((cx + rad * x1) / cell);
        const gy = Math.floor((cy - rad * y2) / cell);
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

      // plate rule
      ctx.beginPath();
      ctx.arc(cx, cy, rad + 1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(23,23,26,0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // the plate prints itself in, once per screen
      const reveal = reduced ? 1 : Math.min(1, (t - printStart.current) / 820);
      const maxLog = Math.log(1 + max);

      for (let gy = 1; gy < rows - 1; gy++) {
        for (let gx = 1; gx < cols - 1; gx++) {
          const idx = gy * cols + gx;
          const c = counts[idx];
          if (c < 0.02) continue;

          // diagonal sweep: cells appear in reading order as the plate prints
          const order = (gx / cols + gy / rows) / 2;
          if (reveal < order) continue;

          const coverage = Math.log(1 + c) / maxLog;
          const level = coverage * (shade[idx] / c);

          let threshold: number;
          if (matrix) {
            threshold = (matrix[gy % spec.size][gx % spec.size] + 0.5) / levels;
          } else {
            const h = Math.sin(gx * 127.1 + gy * 311.7) * 43758.5453;
            threshold = h - Math.floor(h);
          }
          if (level <= threshold * 0.7) continue;

          const alpha = Math.min(0.92, 0.3 + level * 0.72);
          ctx.fillStyle = `rgba(23,23,26,${alpha})`;
          ctx.fillRect(Math.round(gx * cell), Math.round(gy * cell), cell - 1.4, cell - 1.4);
        }
      }

      // crosshair readout
      const h = hover.current;
      if (h) {
        const dx = h.x - cx;
        const dy = cy - h.y;
        const nx = dx / rad;
        const ny = dy / rad;
        const r2 = nx * nx + ny * ny;
        if (r2 <= 0.985) {
          const nz = Math.sqrt(1 - r2);
          const yBack = ny * cosP + nz * sinP;
          const z1Back = -ny * sinP + nz * cosP;
          const xBack = nx * cosY - z1Back * sinY;
          const zBack = nx * sinY + z1Back * cosY;
          const lat = (Math.asin(Math.max(-1, Math.min(1, yBack))) * 180) / Math.PI;
          const lon = (Math.atan2(zBack, xBack) * 180) / Math.PI;
          const ns = `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'}`;
          const ew = `${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;
          setCoord(`${ns} ${ew}`);

          ctx.strokeStyle = 'rgba(138,51,36,0.85)';
          ctx.lineWidth = 1;
          const g = 7;
          for (const [ax, ay, bx, by] of [
            [h.x - g - 4, h.y, h.x - g, h.y],
            [h.x + g, h.y, h.x + g + 4, h.y],
            [h.x, h.y - g - 4, h.x, h.y - g],
            [h.x, h.y + g, h.x, h.y + g + 4],
          ]) {
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
          ctx.fillStyle = 'rgba(138,51,36,0.85)';
          ctx.fillRect(h.x - 0.5, h.y - 0.5, 1.4, 1.4);
        } else {
          setCoord(null);
        }
      }
    };

    raf = requestAnimationFrame(draw);
    draw(performance.now());
    window.addEventListener('resize', resize);

    const down = (e: PointerEvent) => {
      drag.current = { active: true, lastX: e.clientX, lastY: e.clientY, moved: false };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (clearTimer.current) {
        clearTimeout(clearTimer.current);
        clearTimer.current = null;
      }
      const r = canvas.getBoundingClientRect();
      const hx = e.clientX - r.left;
      const hy = e.clientY - r.top;
      hover.current = { x: hx, y: hy };
      const nx2 = (hx - r.width / 2) / (r.width / 2);
      const ny2 = (hy - r.height / 2) / (r.height / 2);
      tilt.current.tx = Math.max(-1, Math.min(1, nx2)) * 0.10;
      tilt.current.ty = Math.max(-1, Math.min(1, ny2)) * 0.07;
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      const dy = e.clientY - drag.current.lastY;
      if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      const mm = motion.current;
      mm.yaw += dx * 0.006;
      mm.pitch += dy * 0.004;
      mm.vy = dx * 0.001;
      mm.vp = dy * 0.0008;
    };
    const up = () => {
      drag.current.active = false;
      canvas.style.cursor = 'grab';
    };
    const leave = () => {
      hover.current = null;
      tilt.current.tx = 0;
      tilt.current.ty = 0;
      // let the last reading stand a moment so it can actually be read
      if (clearTimer.current) clearTimeout(clearTimer.current);
      clearTimer.current = setTimeout(() => setCoord(null), 2200);
    };

    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', leave);

    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('pointerleave', leave);
    };
  }, [mode, size]);

  const current = MODES.find((m) => m.id === mode) ?? MODES[0];

  return (
    <figure>
      <div className="plate relative">
        <canvas ref={canvasRef} aria-hidden="true" className="mx-auto block" />
        {coord && (
          <span className="mono-label tabular pointer-events-none absolute bottom-3 left-4 bg-[#f7f4ed] px-1 text-accent">
            {coord}
          </span>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="mono-label">
          <span className="mark">Plate I</span> — landmass · drag / hover
        </span>
        <button
          type="button"
          onClick={cycle}
          className="mono-label text-left underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
          aria-label="Change the dither screen"
        >
          {current.label} ↻
        </button>
      </figcaption>
    </figure>
  );
}
