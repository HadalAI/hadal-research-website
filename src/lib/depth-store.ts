/**
 * Sounding state: whether the site is reporting metres instead of percent.
 * Deliberately undocumented in the UI — see `sounding.tsx`.
 */

let on = false;
const subs = new Set<(v: boolean) => void>();

export const depthMode = {
  get: () => on,
  set(next: boolean) {
    if (on === next) return;
    on = next;
    subs.forEach((f) => f(next));
  },
  toggle() {
    this.set(!on);
  },
  sub(f: (v: boolean) => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

export const MAX_DEPTH = 10911;

export const CHALLENGER = { lat: 11.35, lon: 142.2 };

export function depthFor(scrollTop: number, scrollHeight: number, clientHeight: number) {
  const max = scrollHeight - clientHeight;
  const pct = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 1;
  return Math.round(pct * MAX_DEPTH);
}

export function metres(d: number) {
  return `${d.toLocaleString('en-US').replace(/,/g, ' ')} m`;
}
