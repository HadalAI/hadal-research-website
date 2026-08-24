'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

/**
 * WebGL Earth via cobe: real continent dots (16k samples), atmosphere glow,
 * network arcs between hub cities, spring-damped drag rotation + idle spin.
 */
const HUB_ARCS: { from: [number, number]; to: [number, number] }[] = [
  { from: [37.77, -122.42], to: [40.71, -74.0] }, // SF - NYC
  { from: [40.71, -74.0], to: [51.5, -0.12] }, // NYC - London
  { from: [51.5, -0.12], to: [48.85, 2.35] }, // London - Paris
  { from: [48.85, 2.35], to: [30.04, 31.24] }, // Paris - Cairo
  { from: [35.68, 139.69], to: [1.35, 103.82] }, // Tokyo - Singapore
  { from: [1.35, 103.82], to: [-33.87, 151.21] }, // Singapore - Sydney
  { from: [-23.55, -46.63], to: [19.08, 72.88] }, // Sao Paulo - Mumbai
  { from: [19.08, 72.88], to: [39.9, 116.4] }, // Mumbai - Beijing
  { from: [30.04, 31.24], to: [-1.29, 36.82] }, // Cairo - Nairobi
  { from: [-34.6, -58.38], to: [-23.55, -46.63] }, // Buenos Aires - Sao Paulo
  { from: [25.2, 55.27], to: [30.04, 31.24] }, // Dubai - Cairo
];

const MARKERS = [
  ...new Set(
    HUB_ARCS.flatMap((a) => [a.from.join(','), a.to.join(',')]),
  ),
].map((loc) => ({
  location: loc.split(',').map(Number) as [number, number],
  size: 0.06,
}));

export default function GlobeField({ size = 520 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let phi = 0.3;
    let width = size;

    const onResize = () => {
      width = Math.min(canvas.offsetWidth, size);
    };
    window.addEventListener('resize', onResize);

    const opts = {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: size * 2,
      height: size * 2,
      phi,
      theta: 0.22,
      dark: 1,
      diffuse: 2.2,
      mapSamples: 20000,
      mapBrightness: 9,
      mapBaseBrightness: 0.06,
      baseColor: [0.09, 0.14, 0.22] as [number, number, number],
      markerColor: [0.62, 0.9, 1] as [number, number, number],
      glowColor: [0.16, 0.45, 0.8] as [number, number, number],
      markers: MARKERS,
      arcs: HUB_ARCS,
      arcColor: [0.45, 0.78, 1] as [number, number, number],
      arcWidth: 0.25,
      arcHeight: 0.22,
      opacity: 1,
    };
    const globe = createGlobe(canvas, opts);

    // spring-smoothed rotation: target follows drag, current lerps toward it each frame
    let raf = 0;
    let currentPhi = phi;
    const tick = () => {
      if (!pointerInteracting.current) phi += 0.0025;
      const target = phi + pointerMovement.current / 4000;
      currentPhi += (target - currentPhi) * 0.06; // lerp factor = smoothness
      globe.update({
        phi: currentPhi,
        width: width * 2,
        height: width * 2,
      });
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onPointerDown = (e: PointerEvent) => {
      pointerInteracting.current = e.clientX - pointerMovement.current;
      canvas.style.cursor = 'grabbing';
    };
    const onPointerUp = () => {
      pointerInteracting.current = null;
      canvas.style.cursor = 'grab';
    };
    const onPointerOut = () => {
      pointerInteracting.current = null;
      canvas.style.cursor = 'grab';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (pointerInteracting.current !== null) {
        pointerMovement.current = e.clientX - pointerInteracting.current;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (pointerInteracting.current !== null && e.touches[0]) {
        pointerMovement.current = e.touches[0].clientX - pointerInteracting.current;
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointerout', onPointerOut);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    canvas.style.cursor = 'grab';

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [size]);

  return (
    <canvas
      ref={ref}
      style={{
        width: size,
        height: size,
        maxWidth: '100%',
        aspectRatio: '1',
        contain: 'layout paint size',
      }}
      aria-hidden="true"
    />
  );
}
