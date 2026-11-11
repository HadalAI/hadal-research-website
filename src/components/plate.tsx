'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LAND_RINGS } from '@/lib/land-rings';
import { CHALLENGER } from '@/lib/depth-store';

/**
 * Plate I — the earth, drawn on paper.
 *
 * Land is a real coastline set (Natural Earth 50m) rasterised once into an
 * equirectangular mask. Each frame the sphere is rendered per pixel into an
 * ImageData buffer: for every pixel the view ray meets the sphere at a known
 * normal, which is rotated into globe space and sampled from the mask. That
 * gives true 3D rotation — pitch included — with no polygon clipping, no seams
 * at the limb and no polar artefacts.
 *
 * Cost control: the buffer is rendered at CSS resolution (not 2x or 4x), only
 * while something is moving, and at 24 fps for the unattended spin.
 */

type Pin = { lat: number; lon: number; label?: string };

const D2R = Math.PI / 180;
const TAU = Math.PI * 2;
const TILT = -16;
const MASK_W = 4096;
const MASK_H = 2048;
const LIGHT = { x: -0.45, y: 0.52, z: 0.72 };

function fmt(v: number, pos: string, neg: string) {
  return `${Math.abs(v).toFixed(1)}°${v >= 0 ? pos : neg}`;
}

export default function Plate({ size = 420 }: { size?: number }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const view = useRef({
    lon: -30,
    lat: 16,
    zoom: 1,
    vlon: 0,
    vlat: 0,
    spin: false,
    drag: false,
    lastX: 0,
    lastY: 0,
    hover: null as { x: number; y: number } | null,
    pins: [] as Pin[],
  });

  const [coord, setCoord] = useState<string | null>(null);
  const [spin, setSpin] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const [zoomLabel, setZoomLabel] = useState('1.0×');
  const [idle, setIdle] = useState(false);

  const reset = useCallback(() => {
    const v = view.current;
    v.lon = -30;
    v.lat = 16;
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
    const shell = shellRef.current;
    const canvas = canvasRef.current;
    if (!shell || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const v = view.current;
    // the canvas is scaled by the browser anyway; 1.5x is the point where the
    // difference stops being visible and the raster cost halves
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = size;
    let h = size;
    let visible = true;
    let pending = true;
    let lastRender = 0;
    let lastInput = Date.now();
    let idleNow = false;
    let raf = 0;
    let quality = 1; // drops to 0.8 / 0.65 if frames get expensive

    /* ---------- land mask ---------- */
    let MASK: Uint8Array | null = null;
    {
      const mc = document.createElement('canvas');
      mc.width = MASK_W;
      mc.height = MASK_H;
      const mx = mc.getContext('2d', { willReadFrequently: true });
      if (mx) {
        mx.fillStyle = '#000';
        mx.fillRect(0, 0, MASK_W, MASK_H);
        mx.fillStyle = '#fff';
        for (const ring of LAND_RINGS) {
          mx.beginPath();
          for (let i = 0; i < ring.length; i++) {
            const [lon, lat] = ring[i];
            const x = ((lon + 180) / 360) * MASK_W;
            const y = ((90 - lat) / 180) * MASK_H;
            if (i === 0) mx.moveTo(x, y);
            else mx.lineTo(x, y);
          }
          mx.closePath();
          mx.fill();
        }
        const d = mx.getImageData(0, 0, MASK_W, MASK_H).data;
        MASK = new Uint8Array(MASK_W * MASK_H);
        for (let i = 0, j = 0; i < d.length; i += 4, j++) MASK[j] = d[i];
      }
    }

    /* ---------- paper ---------- */
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
      sh.addColorStop(0, 'rgba(23,23,26,0.13)');
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
          img.data[i + 3] = Math.random() * 14;
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

    /* ---------- sphere buffer ---------- */
    const sphere = document.createElement('canvas');
    const sctx = sphere.getContext('2d');
    let img: ImageData | null = null;
    let bufW = 0;
    let nxT: Float32Array = new Float32Array(0);
    let nyT: Float32Array = new Float32Array(0);
    let nzT: Float32Array = new Float32Array(0);
    let shadeT: Float32Array = new Float32Array(0);
    let inside: Uint8Array = new Uint8Array(0);

    const buildBuffers = (S: number) => {
      bufW = S;
      sphere.width = S;
      sphere.height = S;
      img = sctx ? sctx.createImageData(S, S) : null;
      const n = S * S;
      nxT = new Float32Array(n);
      nyT = new Float32Array(n);
      nzT = new Float32Array(n);
      shadeT = new Float32Array(n);
      inside = new Uint8Array(n);
      const c = -TILT * D2R;
      const ct = Math.cos(c);
      const st = Math.sin(c);
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const i = y * S + x;
          const u = ((x + 0.5) / S) * 2 - 1;
          const vv = ((y + 0.5) / S) * 2 - 1;
          const r2 = u * u + vv * vv;
          if (r2 > 1) continue;
          inside[i] = 1;
          // undo the page tilt, then convert to a right-handed view normal
          const ux = u * ct - vv * st;
          const uy = u * st + vv * ct;
          const X = ux;
          const Y = -uy;
          const Z = Math.sqrt(Math.max(0, 1 - r2));
          nxT[i] = X;
          nyT[i] = Y;
          nzT[i] = Z;
          const lam = Math.max(0, X * LIGHT.x + Y * LIGHT.y + Z * LIGHT.z);
          shadeT[i] = 0.32 + 0.68 * Math.pow(lam, 0.9);
        }
      }
    };

    /* ---------- wash ---------- */
    const wash = document.createElement('canvas');
    const wctx = wash.getContext('2d');
    let washKey = '';

    const paintWash = (cx: number, cy: number, R: number) => {
      if (!wctx) return;
      wash.width = Math.round(w * dpr);
      wash.height = Math.round(h * dpr);
      wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wctx.clearRect(0, 0, w, h);
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
      term.addColorStop(0.5, 'rgba(244,241,233,0.06)');
      term.addColorStop(0.76, 'rgba(244,241,233,0.34)');
      term.addColorStop(0.92, 'rgba(244,241,233,0.76)');
      term.addColorStop(1, 'rgba(244,241,233,0.94)');
      wctx.fillStyle = term;
      wctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      wctx.beginPath();
      wctx.arc(cx, cy, R - 0.5, 0, TAU);
      wctx.strokeStyle = 'rgba(23,23,26,0.3)';
      wctx.lineWidth = 1;
      wctx.stroke();
    };

    const resize = () => {
      w = Math.max(180, Math.min(shell.clientWidth || size, size));
      h = w;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      paperKey = '';
      washKey = '';
      buildBuffers(Math.max(160, Math.round(w * 0.42 * 2 * 1.8 * quality)));
      pending = true;
    };
    resize();

    const project = (latDeg: number, lonDeg: number, cx: number, cy: number, R: number) => {
      const lat = latDeg * D2R;
      const lon = lonDeg * D2R;
      const p = view.current.lat * D2R;
      const l0 = view.current.lon * D2R;
      const x = Math.cos(lat) * Math.cos(lon);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.sin(lon);
      const z1 = x * Math.cos(l0) + z * Math.sin(l0);
      const X = -x * Math.sin(l0) + z * Math.cos(l0);
      const Y = y * Math.cos(p) - z1 * Math.sin(p);
      const Z = y * Math.sin(p) + z1 * Math.cos(p);
      return { x: cx + R * X, y: cy - R * Y, front: Z > 0 };
    };

    const tilted = (x: number, y: number, cx: number, cy: number) => {
      const a = TILT * D2R;
      const dx = x - cx;
      const dy = y - cy;
      return {
        x: cx + dx * Math.cos(a) - dy * Math.sin(a),
        y: cy + dx * Math.sin(a) + dy * Math.cos(a),
      };
    };

    const untilted = (x: number, y: number, cx: number, cy: number) => {
      const a = -TILT * D2R;
      const dx = x - cx;
      const dy = y - cy;
      return {
        x: cx + dx * Math.cos(a) - dy * Math.sin(a),
        y: cy + dx * Math.sin(a) + dy * Math.cos(a),
      };
    };

    const render = () => {
      const cx = w / 2;
      const cy = h / 2;
      const R = w * 0.42 * v.zoom;

      if (paperKey !== `${w}|${v.zoom}`) {
        paintPaper(cx, cy, R);
        if (shell) shell.style.backgroundImage = `url(${paper.toDataURL()})`;
        paperKey = `${w}|${v.zoom}`;
      }
      if (washKey !== `${w}|${v.zoom}`) {
        paintWash(cx, cy, R);
        washKey = `${w}|${v.zoom}`;
      }

      // view -> globe: undo pitch, then undo the meridian rotation
      const clon = Math.cos(v.lon * D2R);
      const slon = Math.sin(v.lon * D2R);
      const cp = Math.cos(v.lat * D2R);
      const sp = Math.sin(v.lat * D2R);

      if (img && MASK) {
        const px = img.data;
        const S = bufW;
        for (let i = 0, n = S * S; i < n; i++) {
          if (!inside[i]) continue;
          px[i * 4 + 3] = 0;
          const X = nxT[i];
          const Y = nyT[i];
          const Z = nzT[i];

          // inverse pitch
          const y1 = Y * cp + Z * sp;
          const z1 = -Y * sp + Z * cp;
          // inverse meridian rotation
          const gx = z1 * clon - X * slon;
          const gz = z1 * slon + X * clon;
          const gy = y1;

          const lat = Math.asin(gy > 1 ? 1 : gy < -1 ? -1 : gy);
          const lon = Math.atan2(gz, gx);

          const u = (lon * 0.159154943 + 0.5) * MASK_W - 0.5;
          const vv = (0.5 - lat * 0.318309886) * MASK_H - 0.5;
          const x0 = u | 0;
          const y0 = vv | 0;
          const fx = u - x0;
          const fy = vv - y0;
          const xa = x0 < 0 ? 0 : x0 >= MASK_W - 1 ? MASK_W - 2 : x0;
          const ya = y0 < 0 ? 0 : y0 >= MASK_H - 1 ? MASK_H - 2 : y0;
          const i00 = ya * MASK_W + xa;
          const a0 = MASK[i00] + (MASK[i00 + 1] - MASK[i00]) * fx;
          const b0 = MASK[i00 + MASK_W] + (MASK[i00 + MASK_W + 1] - MASK[i00 + MASK_W]) * fx;
          const land = a0 + (b0 - a0) * fy;
          if (!land) continue;

          // alpha must be written as an 8-bit value, not a 0..1 float
          const a = (land / 255) * shadeT[i] * 0.95 * 255;
          const o = i * 4;
          px[o] = 24;
          px[o + 1] = 24;
          px[o + 2] = 28;
          px[o + 3] = a > 255 ? 255 : a;
        }
      }

      if (img && sctx) sctx.putImageData(img, 0, 0);

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(sphere, cx - R, cy - R, R * 2, R * 2);

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.clip();

      // graticule
      const lines = [new Path2D(), new Path2D(), new Path2D()];
      const addLine = (a: { x: number; y: number }, b: { x: number; y: number }, depth: number) => {
        if (depth < 0) return;
        const band = depth > 0.55 ? 2 : depth > 0.1 ? 1 : 0;
        lines[band].moveTo(a.x, a.y);
        lines[band].lineTo(b.x, b.y);
      };
      for (let m = 0; m < 12; m++) {
        const lon = m * 30;
        for (let s = -84; s < 84; s += 4) {
          const a = project(s, lon, cx, cy, R);
          const b = project(s + 4, lon, cx, cy, R);
          if (!a.front || !b.front) continue;
          addLine(a, b, Math.min(a.front ? 1 : 0, 1) * Math.cos(s * D2R));
        }
      }
      for (let p = -60; p <= 60; p += 30) {
        for (let s = -90; s < 90; s += 3) {
          const a = project(p, v.lon + s, cx, cy, R);
          const b = project(p, v.lon + s + 3, cx, cy, R);
          if (!a.front || !b.front) continue;
          addLine(a, b, Math.cos(p * D2R) * Math.cos(s * D2R));
        }
      }
      ctx.lineWidth = 0.6;
      [0.05, 0.075, 0.11].forEach((alpha, i) => {
        ctx.strokeStyle = `rgba(23,23,26,${alpha})`;
        ctx.stroke(lines[i]);
      });

      ctx.drawImage(wash, cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      // pins
      v.pins.forEach((pin, i) => {
        const p = project(pin.lat, pin.lon, cx, cy, R);
        if (!p.front) return;
        const q = tilted(p.x, p.y, cx, cy);
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
        const u = untilted(hv.x, hv.y, cx, cy);
        const dx = (u.x - cx) / R;
        const dy = (cy - u.y) / R;
        const r2 = dx * dx + dy * dy;
        if (r2 <= 1) {
          const dz = Math.sqrt(Math.max(0, 1 - r2));
          const y1 = dy * cp + dz * sp;
          const z1 = -dy * sp + dz * cp;
          const gx = z1 * clon - dx * slon;
          const gy = y1;
          const gz = z1 * slon + dx * clon;
          const lat = Math.asin(Math.max(-1, Math.min(1, gy))) / D2R;
          const lon = Math.atan2(gz, gx) / D2R;
          setCoord(`${fmt(lat, 'N', 'S')} ${fmt(lon, 'E', 'W')}`);

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
    };

    const step = (dt: number) => {
      const quiet = Date.now() - lastInput > 80000;
      if (quiet !== idleNow) {
        idleNow = quiet;
        setIdle(quiet);
      }
      const frames = dt / 16.7;
      if (!quiet) {
        v.lon += v.vlon * frames + (v.spin && !v.drag && !reduced ? 0.03 * frames : 0);
        v.lat += v.vlat * frames;
      }
      v.vlon *= Math.pow(0.94, frames);
      v.vlat *= Math.pow(0.9, frames);
      v.lat = Math.max(-80, Math.min(80, v.lat));
      if (v.lon > 180) v.lon -= 360;
      if (v.lon < -180) v.lon += 360;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;

      const now = performance.now();
      const dt = Math.min(64, now - lastRender);
      const coasting = Math.abs(v.vlon) + Math.abs(v.vlat) > 0.002;
      const moving = v.spin || v.drag || v.hover || pending || coasting;
      if (!moving) return;
      if (idleNow && !pending && !v.hover) return;

      const cheapOnly = !v.drag && !v.hover && !pending && !coasting;
      if (dt < (cheapOnly ? 95 : 33)) return;

      const t0 = performance.now();
      lastRender = now;
      pending = false;
      step(dt);
      render();
      const cost = performance.now() - t0;

      // if frames get expensive, render the sphere smaller and let it scale
      if (cost > 11 && quality > 0.7) {
        quality = 0.7;
        buildBuffers(Math.max(160, Math.round(w * 0.42 * 2 * 1.8 * quality)));
      }
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
      const cx = canvas.clientWidth / 2;
      const cy = canvas.clientHeight / 2;
      const R = canvas.clientWidth * 0.42 * v.zoom;
      const a = -TILT * D2R;
      const dx = x - cx;
      const dy = y - cy;
      const ux = dx * Math.cos(a) - dy * Math.sin(a);
      const uy = dx * Math.sin(a) + dy * Math.cos(a);
      const r2 = (ux * ux + uy * uy) / (R * R);
      if (r2 > 1) return;

      const X = ux / R;
      const Y = -uy / R;
      const Z = Math.sqrt(Math.max(0, 1 - (X * X + Y * Y)));

      const clon = Math.cos(v.lon * D2R);
      const slon = Math.sin(v.lon * D2R);
      const cp = Math.cos(v.lat * D2R);
      const sp = Math.sin(v.lat * D2R);
      const y1 = Y * cp + Z * sp;
      const z1 = -Y * sp + Z * cp;
      const gx = z1 * clon - X * slon;
      const gy = y1;
      const gz = z1 * slon + X * clon;

      const lat = Math.asin(Math.max(-1, Math.min(1, gy))) / D2R;
      const lon = Math.atan2(gz, gx) / D2R;

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
      else if (e.key === 'ArrowUp') v.lat -= s;
      else if (e.key === 'ArrowDown') v.lat += s;
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
      <div ref={shellRef} className="relative" style={{ backgroundSize: '100% 100%' }}>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label="Interactive globe. Drag to turn in any direction, wheel to zoom, click to pin a coordinate."
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
