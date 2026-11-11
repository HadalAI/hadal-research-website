'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LAND_DOTS } from '@/lib/land-dots';
import { CHALLENGER } from '@/lib/depth-store';

/**
 * A lit point-cloud earth that sits on the paper, no frame.
 *
 * Cost control: the sphere body, its shadow and the shading overlay are painted
 * once into an offscreen layer and blitted; dots and graticule are accumulated
 * into a handful of Path2D batches so a frame costs about eight fills instead of
 * six thousand circles. Nothing is drawn at all when the plate is still.
 */

type Vec = { x: number; y: number; z: number };
type Pin = { lat: number; lon: number; label?: string };
type Cell = [number, number];

const D2R = Math.PI / 180;
const TAU = Math.PI * 2;
const BUCKETS = 5;

function toVec(lon: number, lat: number): Vec {
  const cl = Math.cos(lat * D2R);
  return { x: cl * Math.cos(lon * D2R), y: Math.sin(lat * D2R), z: cl * Math.sin(lon * D2R) };
}

const LAND: Vec[] = LAND_DOTS.map(([lon, lat]) => toVec(lon, lat));

// sub-pixel jitter: breaks the arithmetic spiral without changing density
const JITTER = LAND_DOTS.map((_, i) => {
  const a = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  const b = Math.sin(i * 269.5 + 183.3) * 28001.8384;
  return { x: (a - Math.floor(a) - 0.5) * 1.9, y: (b - Math.floor(b) - 0.5) * 1.9 };
});

function rotate(v: Vec, lon: number, lat: number): Vec {
  const cy = Math.cos(lon * D2R);
  const sy = Math.sin(lon * D2R);
  const cp = Math.cos(lat * D2R);
  const sp = Math.sin(lat * D2R);
  const x1 = v.x * cy + v.z * sy;
  const z1 = -v.x * sy + v.z * cy;
  return { x: x1, y: v.y * cp - z1 * sp, z: v.y * sp + z1 * cp };
}

function fmt(v: number, pos: string, neg: string) {
  return `${Math.abs(v).toFixed(1)}°${v >= 0 ? pos : neg}`;
}

const LIGHT = { x: -0.42, y: 0.5, z: 0.76 };

export default function Plate({ size = 420 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const view = useRef({
    lon: -28,
    lat: 18,
    zoom: 1,
    vlon: 0,
    vlat: 0,
    spin: true,
    drag: false,
    lastX: 0,
    lastY: 0,
    hover: null as { x: number; y: number } | null,
    pins: [] as Pin[],
  });

  const [coord, setCoord] = useState<string | null>(null);
  const [spin, setSpin] = useState(true);
  const [pins, setPins] = useState<Pin[]>([]);
  const [zoomLabel, setZoomLabel] = useState('1.0×');
  const [idle, setIdle] = useState(false);

  const reset = useCallback(() => {
    const v = view.current;
    v.lon = -28;
    v.lat = 18;
    v.zoom = 1;
    v.vlon = 0;
    v.vlat = 0;
    setZoomLabel('1.0×');
  }, []);

  const toggleSpin = useCallback(() => {
    const v = view.current;
    v.spin = !v.spin;
    setSpin(v.spin);
  }, []);

  const clearPins = useCallback(() => {
    view.current.pins = [];
    setPins([]);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;
    if (!canvas || !shell) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const v = view.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let w = size;
    let h = size;
    let visible = true;
    let pending = true;
    let frame = 0;
    let lastRender = 0;
    let lastInput = Date.now();
    let idleNow = false;

    const body = document.createElement('canvas');
    const bctx = body.getContext('2d');
    let bodyKey = '';
    let grain: HTMLCanvasElement | null = null;

    const paintBody = (cx: number, cy: number, R: number) => {
      if (!bctx) return;
      body.width = Math.round(w * dpr);
      body.height = Math.round(h * dpr);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, w, h);

      // contact shadow
      bctx.save();
      bctx.translate(cx + R * 0.05, cy + R * 0.99);
      bctx.scale(1, 0.12);
      const sh = bctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 0.92);
      sh.addColorStop(0, 'rgba(23,23,26,0.17)');
      sh.addColorStop(1, 'rgba(23,23,26,0)');
      bctx.fillStyle = sh;
      bctx.beginPath();
      bctx.arc(0, 0, R * 0.92, 0, TAU);
      bctx.fill();
      bctx.restore();

      // ocean: a quiet sheet, lit from the upper left
      const g = bctx.createLinearGradient(cx - R * 0.8, cy - R * 0.8, cx + R * 0.9, cy + R * 0.9);
      g.addColorStop(0, '#f9f6ef');
      g.addColorStop(0.5, '#efebdf');
      g.addColorStop(1, '#e0dac6');
      bctx.beginPath();
      bctx.arc(cx, cy, R, 0, TAU);
      bctx.fillStyle = g;
      bctx.fill();

      // the edge of the sphere turns away from you
      const rim = bctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R);
      rim.addColorStop(0, 'rgba(23,23,26,0)');
      rim.addColorStop(0.75, 'rgba(23,23,26,0.02)');
      rim.addColorStop(1, 'rgba(23,23,26,0.11)');
      bctx.beginPath();
      bctx.arc(cx, cy, R, 0, TAU);
      bctx.fillStyle = rim;
      bctx.fill();

      if (!grain) {
        grain = document.createElement('canvas');
        grain.width = 96;
        grain.height = 96;
        const gc = grain.getContext('2d');
        if (gc) {
          const img = gc.createImageData(96, 96);
          for (let i = 0; i < img.data.length; i += 4) {
            const v = 23 + Math.random() * 40;
            img.data[i] = v;
            img.data[i + 1] = v;
            img.data[i + 2] = v;
            img.data[i + 3] = Math.random() * 26;
          }
          gc.putImageData(img, 0, 0);
        }
      }
      const pattern = bctx.createPattern(grain, 'repeat');
      if (pattern) {
        bctx.save();
        bctx.beginPath();
        bctx.arc(cx, cy, R, 0, TAU);
        bctx.clip();
        bctx.globalAlpha = 0.5;
        bctx.fillStyle = pattern;
        bctx.fillRect(cx - R, cy - R, R * 2, R * 2);
        bctx.restore();
      }

      bctx.beginPath();
      bctx.arc(cx, cy, R - 0.5, 0, TAU);
      bctx.strokeStyle = 'rgba(23,23,26,0.24)';
      bctx.lineWidth = 1;
      bctx.stroke();
    };

    const resize = () => {
      w = Math.max(180, Math.min(shell.clientWidth || size, size));
      h = w;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bodyKey = '';
      pending = true;
    };
    resize();

    const render = () => {
      const cx = w / 2;
      const cy = h / 2;
      const R = w * 0.42 * v.zoom;
      const d = 3.1;

      if (bodyKey !== `${w}|${v.zoom}`) {
        paintBody(cx, cy, R);
        bodyKey = `${w}|${v.zoom}`;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(body, 0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.clip();

      const project = (p: Vec) => {
        const k = d / (d - p.z);
        return { x: cx + R * p.x * k, y: cy - R * p.y * k, z: p.z };
      };

      // graticule: three depth bands, one stroke each
      const lines = [new Path2D(), new Path2D(), new Path2D()];
      for (let m = 0; m < 12; m++) {
        const lon = m * 30;
        for (let s = -84; s < 84; s += 4) {
          const a = project(rotate(toVec(lon, s), v.lon, v.lat));
          const b = project(rotate(toVec(lon, s + 4), v.lon, v.lat));
          if (a.z < -0.15 || b.z < -0.15) continue;
          const side = 1 - 0.6 * Math.max(0, Math.min(1, (a.x - cx) / R + 0.45));
          const alpha = (0.015 + Math.max(0, (a.z + 0.15) / 1.15) * 0.075) * side;
          const band = alpha > 0.05 ? 2 : alpha > 0.028 ? 1 : 0;
          lines[band].moveTo(a.x, a.y);
          lines[band].lineTo(b.x, b.y);
        }
      }
      for (let p = -60; p <= 60; p += 30) {
        for (let s = 0; s < 360; s += 4) {
          const a = project(rotate(toVec(s, p), v.lon, v.lat));
          const b = project(rotate(toVec(s + 4, p), v.lon, v.lat));
          if (a.z < -0.15 || b.z < -0.15) continue;
          const side = 1 - 0.6 * Math.max(0, Math.min(1, (a.x - cx) / R + 0.45));
          const alpha = (0.015 + Math.max(0, (a.z + 0.15) / 1.15) * 0.07) * side;
          const band = alpha > 0.05 ? 2 : alpha > 0.028 ? 1 : 0;
          lines[band].moveTo(a.x, a.y);
          lines[band].lineTo(b.x, b.y);
        }
      }
      ctx.lineWidth = 0.7;
      const lineAlpha = [0.03, 0.055, 0.085];
      lines.forEach((path, i) => {
        ctx.strokeStyle = `rgba(23,23,26,${lineAlpha[i]})`;
        ctx.stroke(path);
      });

      // land: five brightness batches
      const dots = Array.from({ length: BUCKETS }, () => new Path2D());
      for (let i = 0; i < LAND.length; i++) {
        const r = rotate(LAND[i], v.lon, v.lat);
        if (r.z <= 0.02) continue;
        const q = project(r);
        const lambert = Math.max(0, r.x * LIGHT.x + r.y * LIGHT.y + r.z * LIGHT.z);
        const lit = 0.24 + Math.pow(lambert, 1.25) * 0.76;
        const facing = 0.45 + 0.55 * r.z;
        const radius = (0.6 + 0.85 * lit) * (0.55 + 0.45 * r.z);
        const alpha = Math.min(1, 0.2 + 0.85 * lit * facing);
        const band = Math.min(BUCKETS - 1, Math.floor(alpha * BUCKETS));
        const jx = q.x + JITTER[i].x;
        const jy = q.y + JITTER[i].y;
        dots[band].moveTo(jx + radius, jy);
        dots[band].arc(jx, jy, radius, 0, TAU);
      }
      dots.forEach((path, i) => {
        ctx.fillStyle = `rgba(23,23,26,${((i + 0.5) / BUCKETS).toFixed(3)})`;
        ctx.fill(path);
      });

      ctx.restore();

      v.pins.forEach((pin, i) => {
        const p = rotate(toVec(pin.lon, pin.lat), v.lon, v.lat);
        if (p.z < 0) return;
        const q = project(p);
        const dx = q.x - cx;
        const dy = q.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;

        ctx.fillStyle = 'rgba(138,51,36,0.95)';
        ctx.beginPath();
        ctx.arc(q.x, q.y, 2.4, 0, TAU);
        ctx.fill();

        ctx.strokeStyle = 'rgba(138,51,36,0.9)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(q.x + ux * 13, q.y + uy * 13);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(q.x + ux * 14, q.y + uy * 14, 3.4, 0, TAU);
        ctx.fillStyle = '#8a3324';
        ctx.fill();

        ctx.font = '9px ui-monospace, monospace';
        const tx = q.x + ux * 14 + 6;
        const ty = q.y + uy * 14 - 4;
        if (pin.label) {
          const tw = ctx.measureText(pin.label).width;
          ctx.fillStyle = 'rgba(246,243,236,0.94)';
          ctx.fillRect(tx - 3, ty - 8, tw + 6, 11);
          ctx.strokeStyle = 'rgba(138,51,36,0.35)';
          ctx.lineWidth = 0.6;
          ctx.strokeRect(tx - 3, ty - 8, tw + 6, 11);
        }
        ctx.fillStyle = '#8a3324';
        ctx.fillText(pin.label ?? String(i + 1), tx, ty);
      });

      const hv = v.hover;
      if (hv) {
        const nx = (hv.x - w / 2) / R;
        const ny = -(hv.y - h / 2) / R;
        const rr = nx * nx + ny * ny;
        if (rr <= 0.98) {
          const nz = Math.sqrt(Math.max(0, 1 - rr));
          const cp = Math.cos(-v.lat * D2R);
          const sp = Math.sin(-v.lat * D2R);
          const cyw = Math.cos(-v.lon * D2R);
          const syw = Math.sin(-v.lon * D2R);
          const x1 = nx * cyw - nz * syw;
          const z1 = nx * syw + nz * cyw;
          const y2 = ny * cp - z1 * sp;
          const z2 = ny * sp + z1 * cp;
          const lat = Math.asin(Math.max(-1, Math.min(1, y2))) / D2R;
          const lon = Math.atan2(z2, x1) / D2R;
          setCoord(`${fmt(lat, 'N', 'S')} ${fmt(lon, 'E', 'W')}`);

          ctx.strokeStyle = 'rgba(138,51,36,0.9)';
          ctx.lineWidth = 1;
          const g = 7;
          ctx.beginPath();
          ctx.moveTo(hv.x - g - 4, hv.y);
          ctx.lineTo(hv.x - g, hv.y);
          ctx.moveTo(hv.x + g, hv.y);
          ctx.lineTo(hv.x + g + 4, hv.y);
          ctx.moveTo(hv.x, hv.y - g - 4);
          ctx.lineTo(hv.x, hv.y - g);
          ctx.moveTo(hv.x, hv.y + g);
          ctx.lineTo(hv.x, hv.y + g + 4);
          ctx.stroke();
        } else {
          setCoord(null);
        }
      }
    };

    const step = (dt: number) => {
      const quiet = Date.now() - lastInput > 80000;
      if (quiet !== idleNow) {
        idleNow = quiet;
        setIdle(quiet);
      }
      const frames = dt / 16.7;
      if (!quiet) {
        v.lon += v.vlon * frames + (v.spin && !v.drag && !reduced ? 0.045 * frames : 0);
        v.lat += v.vlat * frames;
      }
      v.vlon *= Math.pow(0.94, frames);
      v.vlat *= Math.pow(0.9, frames);
      v.lat = Math.max(-78, Math.min(78, v.lat));
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      frame++;
      if (!visible) return;

      const now = performance.now();
      const dt = Math.min(64, now - lastRender);
      const coasting = Math.abs(v.vlon) + Math.abs(v.vlat) > 0.002;
      const moving = v.spin || v.drag || v.hover || pending || coasting;
      if (!moving) return;
      if (idleNow && !pending && !v.hover) return;

      // unattended spin does not need 60 fps
      const cheapOnly = !v.drag && !v.hover && !pending && !coasting;
      if (cheapOnly && dt < 41) return;

      lastRender = now;
      pending = false;
      step(dt);
      render();
    };

    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) pending = true;
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const onResize = () => {
      resize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const v = view.current;

    const local = (e: PointerEvent | MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const unpin = (x: number, y: number) => {
      const R = canvas.clientWidth * 0.42 * v.zoom;
      const nx = (x - canvas.clientWidth / 2) / R;
      const ny = -(y - canvas.clientHeight / 2) / R;
      if (nx * nx + ny * ny > 0.94) return;
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      const cp = Math.cos(-v.lat * D2R);
      const sp = Math.sin(-v.lat * D2R);
      const cyw = Math.cos(-v.lon * D2R);
      const syw = Math.sin(-v.lon * D2R);
      const x1 = nx * cyw - nz * syw;
      const z1 = nx * syw + nz * cyw;
      const y2 = ny * cp - z1 * sp;
      const z2 = ny * sp + z1 * cp;
      const lat = Math.asin(Math.max(-1, Math.min(1, y2))) / D2R;
      let lon = Math.atan2(z2, x1) / D2R;
      if (lon > 180) lon -= 360;
      if (lon < -180) lon += 360;
      return { lat, lon };
    };

    const down = (e: PointerEvent) => {
      const { x, y } = local(e);
      v.drag = true;
      v.lastX = x;
      v.lastY = y;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };

    const move = (e: PointerEvent) => {
      const { x, y } = local(e);
      v.hover = { x, y };
      if (!v.drag) return;
      const dx = x - v.lastX;
      const dy = y - v.lastY;
      v.lastX = x;
      v.lastY = y;
      v.lon += dx * 0.35;
      v.lat += dy * 0.3;
      v.vlon = dx * 0.06;
      v.vlat = dy * 0.05;
    };

    const up = (e: PointerEvent) => {
      const wasDrag = Math.abs(v.vlon) + Math.abs(v.vlat) > 0.4;
      v.drag = false;
      canvas.style.cursor = 'grab';
      if (wasDrag) return;
      const { x, y } = local(e);
      const pin = unpin(x, y);
      if (!pin) return;
      const near =
        Math.abs(pin.lat - CHALLENGER.lat) < 1.4 && Math.abs(pin.lon - CHALLENGER.lon) < 1.6;
      v.pins = [...v.pins, near ? { ...pin, label: 'CHALLENGER DEEP · 10,911 m' } : pin].slice(-5);
      setPins(v.pins);
    };

    const leave = () => {
      v.hover = null;
      setCoord(null);
    };

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      v.zoom = Math.max(0.65, Math.min(2.1, v.zoom * (e.deltaY > 0 ? 0.94 : 1.06)));
      setZoomLabel(`${v.zoom.toFixed(1)}×`);
    };

    const dbl = () => reset();

    const key = (e: KeyboardEvent) => {
      const stepSize = 6;
      if (e.key === 'ArrowLeft') v.lon -= stepSize;
      else if (e.key === 'ArrowRight') v.lon += stepSize;
      else if (e.key === 'ArrowUp') v.lat -= stepSize;
      else if (e.key === 'ArrowDown') v.lat += stepSize;
      else if (e.key === '+' || e.key === '=') {
        v.zoom = Math.min(2.1, v.zoom * 1.08);
        setZoomLabel(`${v.zoom.toFixed(1)}×`);
      } else if (e.key === '-') {
        v.zoom = Math.max(0.65, v.zoom * 0.92);
        setZoomLabel(`${v.zoom.toFixed(1)}×`);
      } else if (e.key.toLowerCase() === 'r') reset();
      else if (e.key === ' ') {
        e.preventDefault();
        toggleSpin();
      } else return;
      e.preventDefault();
    };

    const word = () => {
      const pin = { ...CHALLENGER, label: 'CHALLENGER DEEP · 10,911 m' };
      v.pins = [...v.pins, pin].slice(-5);
      setPins(v.pins);
    };

    document.addEventListener('hadal:challenger', word);

    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', leave);
    canvas.addEventListener('wheel', wheel, { passive: false });
    canvas.addEventListener('dblclick', dbl);
    canvas.addEventListener('keydown', key);

    return () => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('dblclick', dbl);
      canvas.removeEventListener('keydown', key);
      document.removeEventListener('hadal:challenger', word);
    };
  }, [reset, toggleSpin]);

  return (
    <figure>
      <div ref={shellRef} className="relative">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label="Interactive globe. Drag to rotate, wheel to zoom, click to pin a coordinate."
          className="mx-auto block focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
        />
        {coord && (
          <span className="mono-label tabular pointer-events-none absolute bottom-0 left-0 bg-paper px-1 text-accent">
            {coord}
          </span>
        )}
        {pins.length > 0 && (
          <span className="mono-label pointer-events-none absolute bottom-0 right-0 bg-paper px-1">
            {pins.length} pin{pins.length > 1 ? 's' : ''} · {zoomLabel}
          </span>
        )}
      </div>

      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="mono-label">
          <span className="mark">Plate I</span> · {idle ? 'no signal' : 'drag, wheel, click to pin'}
        </span>
        <span className="mono-label flex flex-wrap gap-x-4 gap-y-1">
          <button
            type="button"
            onClick={toggleSpin}
            className="underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-accent"
          >
            {spin ? 'stop spin' : 'spin'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-accent"
          >
            reset
          </button>
          {pins.length > 0 && (
            <button
              type="button"
              onClick={clearPins}
              className="underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-accent"
            >
              clear {pins.length}
            </button>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
