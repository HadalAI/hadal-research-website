'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GLOBE_DATA } from '@/lib/globe-data';

/**
 * Plate I — a lit point-cloud earth you can handle.
 *
 * Perspective projection, lambert shading and a shaded sphere body give it depth
 * on paper. Drag to turn, wheel to zoom, click to pin a coordinate, arrows to
 * steer, r to reset, space to stop the spin.
 */

type Vec = { x: number; y: number; z: number };
type Pin = { lat: number; lon: number };
type Cell = [number, number];

const D2R = Math.PI / 180;

function toVec(lon: number, lat: number): Vec {
  const cl = Math.cos(lat * D2R);
  return { x: cl * Math.cos(lon * D2R), y: Math.sin(lat * D2R), z: cl * Math.sin(lon * D2R) };
}

const LAND: Vec[] = (GLOBE_DATA.l as Cell[]).map(([lon, lat]) => toVec(lon, lat));

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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const v = view.current;

    let raf = 0;
    let w = size;
    let h = size;

    const resize = () => {
      const cs = getComputedStyle(shell);
      const avail =
        shell.clientWidth - parseFloat(cs.paddingLeft || '0') - parseFloat(cs.paddingRight || '0');
      w = Math.max(180, Math.min(avail || size, size));
      h = w;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const cx = w / 2;
      const cy = h / 2;
      const R = w * 0.42 * v.zoom;
      const d = 3.1;

      v.lon += v.vlon + (v.spin && !v.drag && !reduced ? 0.045 : 0);
      v.lat += v.vlat;
      v.vlon *= 0.94;
      v.vlat *= 0.9;
      v.lat = Math.max(-78, Math.min(78, v.lat));

      ctx.clearRect(0, 0, w, h);

      // contact shadow on the paper
      ctx.save();
      ctx.translate(cx, cy + R * 1.02);
      ctx.scale(1, 0.13);
      const sh = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 1.02);
      sh.addColorStop(0, 'rgba(23,23,26,0.16)');
      sh.addColorStop(1, 'rgba(23,23,26,0)');
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.02, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const body = ctx.createRadialGradient(cx - R * 0.34, cy - R * 0.42, R * 0.05, cx, cy, R * 1.08);
      body.addColorStop(0, '#fbf9f3');
      body.addColorStop(0.55, '#efeade');
      body.addColorStop(0.72, '#ece7da');
      body.addColorStop(1, '#cdc6b2');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      // nothing on the sphere may spill past the limb
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      const project = (p: Vec) => {
        const k = d / (d - p.z);
        return { x: cx + R * p.x * k, y: cy - R * p.y * k, z: p.z };
      };

      // graticule
      ctx.lineWidth = 0.8;
      for (let m = 0; m < 12; m++) {
        const lon = m * 30;
        for (let s = -84; s < 84; s += 4) {
          const a = project(rotate(toVec(lon, s), v.lon, v.lat));
          const b = project(rotate(toVec(lon, s + 4), v.lon, v.lat));
          if (a.z < -0.15 || b.z < -0.15) continue;
          const sideFade = 1 - 0.6 * Math.max(0, Math.min(1, (a.x - cx) / R + 0.45));
          const alpha = (0.03 + Math.max(0, (a.z + 0.15) / 1.15) * 0.11) * sideFade;
          ctx.strokeStyle = `rgba(23,23,26,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (let p = -75; p <= 75; p += 15) {
        for (let s = 0; s < 360; s += 4) {
          const a = project(rotate(toVec(s, p), v.lon, v.lat));
          const b = project(rotate(toVec(s + 4, p), v.lon, v.lat));
          if (a.z < -0.15 || b.z < -0.15) continue;
          const sideFade = 1 - 0.6 * Math.max(0, Math.min(1, (a.x - cx) / R + 0.45));
          const alpha = (0.03 + Math.max(0, (a.z + 0.15) / 1.15) * 0.1) * sideFade;
          ctx.strokeStyle = `rgba(23,23,26,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // land: dots sized and lit by the facet normal
      const L = { x: -0.42, y: 0.5, z: 0.76 };
      for (let i = 0; i < LAND.length; i++) {
        const r = rotate(LAND[i], v.lon, v.lat);
        if (r.z < -0.25) continue;
        const q = project(r);
        const lambert = Math.max(0, r.x * L.x + r.y * L.y + r.z * L.z);
        const lit = 0.16 + Math.pow(lambert, 1.5) * 0.84;
        const depth = Math.max(0, (r.z + 0.25) / 1.25);
        const radius = 0.5 + Math.pow(lit, 1.15) * 1.15 * depth;
        ctx.fillStyle = `rgba(23,23,26,${(0.07 + Math.pow(lit, 1.35) * 0.85 * depth).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // terminator: the far side of the sphere falls away
      const term = ctx.createRadialGradient(cx - R * 0.45, cy - R * 0.5, R * 0.15, cx, cy, R * 1.02);
      term.addColorStop(0, 'rgba(255,255,255,0)');
      term.addColorStop(0.5, 'rgba(23,23,26,0.03)');
      term.addColorStop(0.8, 'rgba(23,23,26,0.14)');
      term.addColorStop(1, 'rgba(23,23,26,0.4)');
      ctx.fillStyle = term;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      const glow = ctx.createRadialGradient(cx - R * 0.34, cy - R * 0.38, 0, cx - R * 0.34, cy - R * 0.38, R * 0.62);
      glow.addColorStop(0, 'rgba(255,255,255,0.42)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(23,23,26,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // rim light: the arc catching the lamp
      ctx.beginPath();
      ctx.arc(cx, cy, R - 1, Math.PI * 1.02, Math.PI * 1.42);
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      v.pins.forEach((pin, i) => {
        const p = rotate(toVec(pin.lon, pin.lat), v.lon, v.lat);
        if (p.z < 0) return;
        const q = project(p);
        const dx = q.x - w / 2;
        const dy = q.y - h / 2;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;

        // surface mark
        ctx.fillStyle = 'rgba(138,51,36,0.95)';
        ctx.beginPath();
        ctx.arc(q.x, q.y, 2.4, 0, Math.PI * 2);
        ctx.fill();

        // stalk along the surface normal
        ctx.strokeStyle = 'rgba(138,51,36,0.9)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(q.x + ux * 13, q.y + uy * 13);
        ctx.stroke();

        // head
        ctx.beginPath();
        ctx.arc(q.x + ux * 14, q.y + uy * 14, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = '#8a3324';
        ctx.fill();

        ctx.font = '9px ui-monospace, monospace';
        ctx.fillStyle = '#8a3324';
        ctx.fillText(String(i + 1), q.x + ux * 14 + 6, q.y + uy * 14 - 4);
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
          for (const [ax, ay, bx, by] of [
            [hv.x - g - 4, hv.y, hv.x - g, hv.y],
            [hv.x + g, hv.y, hv.x + g + 4, hv.y],
            [hv.x, hv.y - g - 4, hv.x, hv.y - g],
            [hv.x, hv.y + g, hv.x, hv.y + g + 4],
          ]) {
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        } else {
          setCoord(null);
        }
      }
    };

    raf = requestAnimationFrame(draw);
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
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
      v.pins = [...v.pins, pin].slice(-5);
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
      const step = 6;
      if (e.key === 'ArrowLeft') v.lon -= step;
      else if (e.key === 'ArrowRight') v.lon += step;
      else if (e.key === 'ArrowUp') v.lat -= step;
      else if (e.key === 'ArrowDown') v.lat += step;
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
    };
  }, [reset, toggleSpin]);

  return (
    <figure>
      <div ref={shellRef} className="plate relative">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label="Interactive globe. Drag to rotate, wheel to zoom, click to pin a coordinate."
          className="mx-auto block focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
        />
        {coord && (
          <span className="mono-label tabular pointer-events-none absolute bottom-3 left-4 bg-[#f7f4ed] px-1 text-accent">
            {coord}
          </span>
        )}
        {pins.length > 0 && (
          <span className="mono-label pointer-events-none absolute bottom-3 right-4 bg-[#f7f4ed] px-1">
            {pins.length} pin{pins.length > 1 ? 's' : ''} · {zoomLabel}
          </span>
        )}
      </div>

      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="mono-label">
          <span className="mark">Plate I</span> · drag, wheel, click to pin
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
