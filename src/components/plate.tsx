'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LAND_RINGS } from '@/lib/land-rings';
import { CHALLENGER } from '@/lib/depth-store';

/**
 * Plate I — the earth, drawn on paper.
 *
 * Land is a real coastline set (Natural Earth 50m), rasterised once into an
 * equirectangular mask. The sphere is then drawn scanline by scanline: for each
 * screen row the latitude is known exactly, so the mask row is the only data
 * needed, and each run of land in it maps to a horizontal span of the row. There
 * is no polygon clipping and no horizon problem — a row simply stops where the
 * sphere does.
 *
 * Rotation is longitude-only, like a globe on a stand. A fixed axial tilt is
 * applied when drawing, so the north pole leans without complicating the maths.
 */

type Pin = { lat: number; lon: number; label?: string };

const D2R = Math.PI / 180;
const TAU = Math.PI * 2;
const TILT = -16; // degrees, the axis leans left
const MASK_W = 2048;
const MASK_H = 1024;

function fmt(v: number, pos: string, neg: string) {
  return `${Math.abs(v).toFixed(1)}°${v >= 0 ? pos : neg}`;
}

type Span = { lon0: number; lon1: number };

export default function Plate({ size = 420 }: { size?: number }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const view = useRef({
    lon: -30,
    zoom: 1,
    vlon: 0,
    spin: true,
    drag: false,
    lastX: 0,
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
    v.lon = -30;
    v.zoom = 1;
    v.vlon = 0;
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
    const shell = shellRef.current;
    const canvas = canvasRef.current;
    if (!shell || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const v = view.current;
    // supersample: the canvas is drawn larger than its CSS box and the browser
    // downsamples it, which is the cheapest way to smooth staircase edges
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2) * 2, 4);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = size;
    let h = size;
    let visible = true;
    let pending = true;
    let lastRender = 0;
    let lastInput = Date.now();
    let idleNow = false;
    let raf = 0;

    /* ---------- mask, once ---------- */
    const mask = document.createElement('canvas');
    mask.width = MASK_W;
    mask.height = MASK_H;
    const mctx = mask.getContext('2d', { willReadFrequently: true });
    const ROWS: Span[][] = new Array(MASK_H);

    if (mctx) {
      mctx.fillStyle = '#000';
      mctx.fillRect(0, 0, MASK_W, MASK_H);
      mctx.fillStyle = '#fff';
      for (const ring of LAND_RINGS) {
        mctx.beginPath();
        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i];
          const x = ((lon + 180) / 360) * MASK_W;
          const y = ((90 - lat) / 180) * MASK_H;
          if (i === 0) mctx.moveTo(x, y);
          else mctx.lineTo(x, y);
        }
        mctx.closePath();
        mctx.fill();
      }

      const data = mctx.getImageData(0, 0, MASK_W, MASK_H).data;
      for (let y = 0; y < MASK_H; y++) {
        const spans: Span[] = [];
        let start = -1;
        for (let x = 0; x < MASK_W; x++) {
          const on = data[(y * MASK_W + x) * 4] > 127;
          if (on && start < 0) start = x;
          if (!on && start >= 0) {
            spans.push({
              lon0: (start / MASK_W) * 360 - 180,
              lon1: ((x - 1) / MASK_W) * 360 - 180,
            });
            start = -1;
          }
        }
        if (start >= 0) {
          spans.push({ lon0: (start / MASK_W) * 360 - 180, lon1: 179.8 });
        }
        ROWS[y] = spans;
      }
    }

    /* ---------- paper layer ---------- */
    const paper = document.createElement('canvas');
    const pctx = paper.getContext('2d');
    let paperKey = '';

    const paintPaper = (cx: number, cy: number, R: number) => {
      if (!pctx) return;
      paper.width = Math.round(w * dpr);
      paper.height = Math.round(h * dpr);
      pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pctx.clearRect(0, 0, w, h);

      pctx.save();
      pctx.translate(cx + R * 0.05, cy + R * 0.98);
      pctx.scale(1, 0.1);
      const sh = pctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 0.88);
      sh.addColorStop(0, 'rgba(23,23,26,0.14)');
      sh.addColorStop(1, 'rgba(23,23,26,0)');
      pctx.fillStyle = sh;
      pctx.beginPath();
      pctx.arc(0, 0, R * 0.88, 0, TAU);
      pctx.fill();
      pctx.restore();

      const sea = pctx.createLinearGradient(cx - R * 0.7, cy - R * 0.8, cx + R * 0.8, cy + R * 0.85);
      sea.addColorStop(0, '#faf7f0');
      sea.addColorStop(0.55, '#f1ece0');
      sea.addColorStop(1, '#e6e0ce');
      pctx.beginPath();
      pctx.arc(cx, cy, R, 0, TAU);
      pctx.fillStyle = sea;
      pctx.fill();

      const grain = document.createElement('canvas');
      grain.width = 96;
      grain.height = 96;
      const gc = grain.getContext('2d');
      if (gc) {
        const img = gc.createImageData(96, 96);
        for (let i = 0; i < img.data.length; i += 4) {
          const val = 40 + Math.random() * 30;
          img.data[i] = val;
          img.data[i + 1] = val;
          img.data[i + 2] = val;
          img.data[i + 3] = Math.random() * 16;
        }
        gc.putImageData(img, 0, 0);
      }
      const pattern = pctx.createPattern(grain, 'repeat');
      if (pattern) {
        pctx.save();
        pctx.beginPath();
        pctx.arc(cx, cy, R, 0, TAU);
        pctx.clip();
        pctx.fillStyle = pattern;
        pctx.fillRect(cx - R, cy - R, R * 2, R * 2);
        pctx.restore();
      }
    };

    /* ---------- the turn of the sphere ---------- */
    const wash = document.createElement('canvas');
    const wctx = wash.getContext('2d');
    let washKey = '';

    const paintWash = (cx: number, cy: number, R: number) => {
      if (!wctx) return;
      wash.width = Math.round(w * dpr);
      wash.height = Math.round(h * dpr);
      wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wctx.clearRect(0, 0, w, h);

      wctx.save();
      wctx.beginPath();
      wctx.arc(cx, cy, R, 0, TAU);
      wctx.clip();

      const term = wctx.createRadialGradient(
        cx - R * 0.5,
        cy - R * 0.52,
        R * 0.18,
        cx - R * 0.5,
        cy - R * 0.52,
        R * 1.92,
      );
      term.addColorStop(0, 'rgba(244,241,233,0)');
      term.addColorStop(0.46, 'rgba(244,241,233,0.08)');
      term.addColorStop(0.7, 'rgba(244,241,233,0.52)');
      term.addColorStop(0.88, 'rgba(244,241,233,0.86)');
      term.addColorStop(1, 'rgba(244,241,233,0.96)');
      wctx.fillStyle = term;
      wctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      wctx.beginPath();
      wctx.arc(cx, cy, R - 0.5, 0, TAU);
      wctx.strokeStyle = 'rgba(23,23,26,0.32)';
      wctx.lineWidth = 1;
      wctx.stroke();

      wctx.beginPath();
      wctx.arc(cx, cy, R - 1.2, Math.PI * 1.04, Math.PI * 1.4);
      wctx.strokeStyle = 'rgba(255,255,255,0.5)';
      wctx.lineWidth = 1.4;
      wctx.stroke();
      wctx.restore();
    };

    const resize = () => {
      w = Math.max(180, Math.min(shell.clientWidth || size, size));
      h = w;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paperKey = '';
      washKey = '';
      pending = true;
    };
    resize();

    // screen <-> sphere helpers, in device pixels
    const project = (latDeg: number, lonDeg: number, cx: number, cy: number, R: number) => {
      const lat = latDeg * D2R;
      const d = (lonDeg - v.lon) * D2R;
      return {
        x: cx + R * Math.cos(lat) * Math.sin(d),
        y: cy - R * Math.sin(lat),
      };
    };

    const unproject = (x: number, y: number, cx: number, cy: number, R: number) => {
      const py = (cy - y) / R;
      const px = (x - cx) / R;
      const cl = Math.sqrt(Math.max(0, 1 - py * py));
      if (cl < 1e-6) return { lat: py > 0 ? 90 : -90, lon: v.lon };
      const s = Math.max(-1, Math.min(1, px / cl));
      return { lat: Math.asin(py) / D2R, lon: v.lon + Math.asin(s) / D2R };
    };

    const render = () => {
      const cx = w / 2;
      const cy = h / 2;
      const R = w * 0.42 * v.zoom;

      if (paperKey !== `${w}|${v.zoom}`) {
        paintPaper(cx, cy, R);
        paperKey = `${w}|${v.zoom}`;
      }
      if (washKey !== `${w}|${v.zoom}`) {
        paintWash(cx, cy, R);
        washKey = `${w}|${v.zoom}`;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(TILT * D2R);
      ctx.translate(-cx, -cy);
      ctx.drawImage(paper, 0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.clip();

      // graticule
      const lines = [new Path2D(), new Path2D(), new Path2D()];
      const addLine = (a: { x: number; y: number }, b: { x: number; y: number }, depth: number) => {
        const band = depth > 0.55 ? 2 : depth > 0.12 ? 1 : 0;
        lines[band].moveTo(a.x, a.y);
        lines[band].lineTo(b.x, b.y);
      };
      for (let m = 0; m < 12; m++) {
        const lon = m * 30;
        for (let s = -86; s < 86; s += 4) {
          const a = project(s, lon, cx, cy, R);
          const b = project(s + 4, lon, cx, cy, R);
          addLine(a, b, Math.cos(s * D2R));
        }
      }
      for (let p = -60; p <= 60; p += 30) {
        for (let s = -90; s < 90; s += 3) {
          const a = project(p, v.lon + s, cx, cy, R);
          const b = project(p, v.lon + s + 3, cx, cy, R);
          addLine(a, b, Math.cos(p * D2R) * Math.cos(s * D2R));
        }
      }
      ctx.lineWidth = 0.7;
      [0.06, 0.09, 0.13].forEach((alpha, i) => {
        ctx.strokeStyle = `rgba(23,23,26,${alpha})`;
        ctx.stroke(lines[i]);
      });

      // land, row by row
      const land = new Path2D();
      const stepY = 1 / dpr;
      for (let y = cy - R; y <= cy + R; y += stepY) {
        const py = (cy - y) / R;
        if (py < -1 || py > 1) continue;
        const lat = Math.asin(py) / D2R;
        const row = ROWS[Math.max(0, Math.min(MASK_H - 1, Math.round(((90 - lat) / 180) * (MASK_H - 1))))];
        if (!row || !row.length) continue;
        const cl = Math.cos(lat * D2R);
        if (cl < 1e-4) continue;

        for (let i = 0; i < row.length; i++) {
          const sp = row[i];
          // spans run west -> east in one piece; test the three copies that can
          // reach the visible meridian sweep, and never reorder them
          const a0 = sp.lon0 - v.lon;
          const a1 = sp.lon1 - v.lon;
          for (let k = -1; k <= 1; k++) {
            const lo = Math.max(a0 - 360 * k, -90);
            const hi = Math.min(a1 - 360 * k, 90);
            if (hi - lo < 0.02) continue;
            const x0 = cx + R * cl * Math.sin(lo * D2R);
            const x1 = cx + R * cl * Math.sin(hi * D2R);
            if (x1 - x0 < 0.05) continue;
            land.rect(x0, y, x1 - x0, stepY * 1.15);
          }
        }
      }
      ctx.fillStyle = 'rgba(26,26,30,0.13)';
      ctx.fill(land);

      // coastlines: the drawing itself, hairline
      const coast = new Path2D();
      for (const ring of LAND_RINGS) {
        let prevVisible = false;
        let px = 0;
        let py = 0;
        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i];
          const d = ((lon - v.lon + 540) % 360) - 180;
          const visible = Math.abs(d) < 90;
          if (visible) {
            const la = lat * D2R;
            const x = cx + R * Math.cos(la) * Math.sin(d * D2R);
            const y = cy - R * Math.sin(la);
            if (prevVisible) {
              coast.moveTo(px, py);
              coast.lineTo(x, y);
            }
            px = x;
            py = y;
          }
          prevVisible = visible;
        }
      }
      ctx.lineWidth = 0.55;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(24,24,28,0.9)';
      ctx.stroke(coast);

      ctx.restore();

      ctx.drawImage(wash, 0, 0, w, h);

      // pins, crosshair and readout ride on the tilted sphere
      const toScreen = (lat: number, lon: number) => {
        const p = project(lat, lon, cx, cy, R);
        const dx = p.x - cx;
        const dy = p.y - cy;
        const a = TILT * D2R;
        return {
          x: cx + dx * Math.cos(a) - dy * Math.sin(a),
          y: cy + dx * Math.sin(a) + dy * Math.cos(a),
        };
      };

      v.pins.forEach((pin, i) => {
        const d = ((pin.lon - v.lon + 540) % 360) - 180;
        if (Math.abs(d) > 90) return;
        const q = toScreen(pin.lat, pin.lon);
        const dx = q.x - cx;
        const dy = q.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;

        ctx.fillStyle = '#8a3324';
        ctx.beginPath();
        ctx.arc(q.x, q.y, 2.6, 0, TAU);
        ctx.fill();

        ctx.strokeStyle = '#8a3324';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(q.x + ux * 13, q.y + uy * 13);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(q.x + ux * 14, q.y + uy * 14, 3.6, 0, TAU);
        ctx.fill();

        ctx.font = '9px ui-monospace, monospace';
        const tx = q.x + ux * 14 + 6;
        const ty = q.y + uy * 14 - 4;
        if (pin.label) {
          const tw = ctx.measureText(pin.label).width;
          ctx.fillStyle = 'rgba(246,243,236,0.94)';
          ctx.fillRect(tx - 3, ty - 8, tw + 6, 11);
          ctx.strokeStyle = 'rgba(138,51,36,0.3)';
          ctx.lineWidth = 0.6;
          ctx.strokeRect(tx - 3, ty - 8, tw + 6, 11);
        }
        ctx.fillStyle = '#8a3324';
        ctx.fillText(pin.label ?? String(i + 1), tx, ty);
      });

      const hv = v.hover;
      if (hv) {
        // undo the tilt, then read the sphere
        const a = -TILT * D2R;
        const dx = hv.x - cx;
        const dy = hv.y - cy;
        const ux = dx * Math.cos(a) - dy * Math.sin(a) + cx;
        const uy = dx * Math.sin(a) + dy * Math.cos(a) + cy;
        if (Math.hypot(ux - cx, uy - cy) <= R) {
          const { lat, lon } = unproject(ux, uy, cx, cy, R);
          const norm = ((lon + 540) % 360) - 180;
          setCoord(`${fmt(lat, 'N', 'S')} ${fmt(norm, 'E', 'W')}`);

          ctx.strokeStyle = 'rgba(138,51,36,0.85)';
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

      ctx.restore();
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
      }
      v.vlon *= Math.pow(0.94, frames);
      if (v.lon > 180) v.lon -= 360;
      if (v.lon < -180) v.lon += 360;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;

      const now = performance.now();
      const dt = Math.min(64, now - lastRender);
      const coasting = Math.abs(v.vlon) > 0.002;
      const moving = v.spin || v.drag || v.hover || pending || coasting;
      if (!moving) return;
      if (idleNow && !pending && !v.hover) return;

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

    const onResize = () => resize();
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

    const down = (e: PointerEvent) => {
      const { x } = local(e);
      v.drag = true;
      v.lastX = x;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };

    const move = (e: PointerEvent) => {
      const { x, y } = local(e);
      v.hover = { x, y };
      if (!v.drag) return;
      const dx = x - v.lastX;
      v.lastX = x;
      v.lon += dx * 0.4;
      v.vlon = dx * 0.06;
    };

    const up = (e: PointerEvent) => {
      const wasDrag = Math.abs(v.vlon) > 0.4;
      v.drag = false;
      canvas.style.cursor = 'grab';
      if (wasDrag) return;

      const { x, y } = local(e);
      const cx = canvas.clientWidth / 2;
      const cy = canvas.clientHeight / 2;
      const R = canvas.clientWidth * 0.42 * v.zoom;
      const a = -TILT * D2R;
      const dx = x - cx;
      const dy = y - cy;
      const ux = dx * Math.cos(a) - dy * Math.sin(a) + cx;
      const uy = dx * Math.sin(a) + dy * Math.cos(a) + cy;
      if (Math.hypot(ux - cx, uy - cy) > R * 0.995) return;

      const py = (cy - uy) / R;
      const px = (ux - cx) / R;
      const cl = Math.sqrt(Math.max(0, 1 - py * py));
      const lat = Math.asin(Math.max(-1, Math.min(1, py))) / D2R;
      let lon = v.lon + Math.asin(Math.max(-1, Math.min(1, px / Math.max(cl, 1e-6)))) / D2R;
      lon = ((lon + 540) % 360) - 180;

      const near = Math.abs(lat - CHALLENGER.lat) < 1.4 && Math.abs(lon - CHALLENGER.lon) < 1.6;
      v.pins = [
        ...v.pins,
        near ? { lat, lon, label: 'CHALLENGER DEEP · 10,911 m' } : { lat, lon },
      ].slice(-5);
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
      const s = 6;
      if (e.key === 'ArrowLeft') v.lon -= s;
      else if (e.key === 'ArrowRight') v.lon += s;
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
          aria-label="Interactive globe. Drag to turn, wheel to zoom, click to pin a coordinate."
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
          <span className="mark">Plate I</span> · {idle ? 'no signal' : 'drag to turn, click to pin'}
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
