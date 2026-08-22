/**
 * Central data layer — the ONLY place metrics come from.
 * Live API when reachable. Placeholder metrics (datasets/experiments/run progress)
 * are defined HERE and only here, so swapping in real endpoints later touches
 * exactly one file.
 */

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';

export type NetworkStats = {
  contributors: number;
  workers_online: number;
  gpu_hours: number;
  active_runs: number;
};

export type RunWithMeta = {
  slug: string;
  name: string;
  description: string;
  status: string;
  /** Placeholder fields until the API serves per-run metrics. */
  progress: number;
  contributors_count: number;
  gpu_hours: number;
  ends_in_days: number;
};

/** Per-run display metadata — single source, replace with API fields when available. */
const RUN_PLACEHOLDER: Record<string, { progress: number; contributors_count: number; gpu_hours: number; ends_in_days: number }> = {
  'hadal-001': { progress: 67, contributors_count: 247, gpu_hours: 12483, ends_in_days: 12 },
};

/** Deterministic pseudo-meta for runs without API metrics yet. */
function metaFor(slug: string) {
  const known = RUN_PLACEHOLDER[slug];
  if (known) return known;
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return {
    progress: 20 + (h % 65),
    contributors_count: 40 + (h % 300),
    gpu_hours: 2000 + (h % 18000),
    ends_in_days: 5 + (h % 20),
  };
}

/** Metrics with no endpoint yet — defined once, here. */
export const NETWORK_EXTRA = {
  gpu_hours_today: 0,
  datasets: 0,
  experiments: 0,
};

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 15 } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function fetchStats(): Promise<NetworkStats> {
  return get<NetworkStats>('/stats', {
    contributors: 0,
    workers_online: 0,
    gpu_hours: 0,
    active_runs: 0,
  });
}

export async function fetchRunCards(): Promise<RunWithMeta[]> {
  const runs = await get<Array<{ slug: string; name: string; description: string; status: string }>>(
    '/research-runs',
    []
  );
  return runs.map((r) => ({ ...r, ...metaFor(r.slug) }));
}

export async function fetchModels(): Promise<
  Array<{ id: string; name: string; description: string; status: string }>
> {
  return get('/models', []);
}

export type WorkerRow = { id: string; gpu: string; vram: number; gpu_hours: number };

export async function fetchWorkers(): Promise<WorkerRow[]> {
  return get('/workers', [] as WorkerRow[]);
}
