'use client';

import { useEffect, useRef } from 'react';

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  active: number; // 0..1 brightness
  pulseAt: number;
};

/**
 * Deep-sea network field: mostly dark nodes drifting almost imperceptibly,
 * a few occasionally pulsing faint blue. Canvas-based, pauses for reduced motion.
 */
export default function NetworkField({ height = 420 }: { height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext('2d');
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    let h = (canvas.height = height * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const N = Math.min(220, Math.floor(canvas.offsetWidth / 6));
    const nodes: Node[] = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      r: 0.8 + Math.random() * 1.4,
      active: Math.random() < 0.06 ? 1 : 0.12 + Math.random() * 0.2,
      pulseAt: Math.random() * 20000,
    }));

    const t0 = performance.now();
    let raf = 0;

    function draw(now: number) {
      ctx.clearRect(0, 0, w, h);
      // faint link lines between close nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 90 * 90 * devicePixelRatio * devicePixelRatio) {
            const a = (1 - d2 / (90 * 90 * devicePixelRatio * devicePixelRatio)) * 0.05;
            ctx.strokeStyle = `rgba(140,160,180,${a})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x / devicePixelRatio, nodes[i].y / devicePixelRatio);
            ctx.lineTo(nodes[j].x / devicePixelRatio, nodes[j].y / devicePixelRatio);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx * devicePixelRatio;
          n.y += n.vy * devicePixelRatio;
        }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const cycle = ((now - t0 + n.pulseAt) % 9000) / 9000;
        const pulse = cycle > 0.92 ? (cycle - 0.92) / 0.08 : 0;
        const alpha = reduced ? n.active : Math.min(n.active + pulse * 0.7, 1);
        ctx.fillStyle =
          pulse > 0 ? `rgba(91,143,168,${alpha})` : `rgba(245,245,242,${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x / devicePixelRatio, n.y / devicePixelRatio, n.r + pulse * 1.5, 0, 7);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    }
    draw(performance.now());
    return () => cancelAnimationFrame(raf);
  }, [height]);

  return (
    <canvas
      ref={ref}
      style={{ width: '100%', height }}
      aria-hidden="true"
      className="block"
    />
  );
}
