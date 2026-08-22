/**
 * Central data layer — the ONLY place numbers come from.
 * Live API when reachable; typed fallbacks otherwise.
 * No component ever hardcodes a metric.
 */

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type NetworkStats = {
  contributors: number;
  workers_online: number;
  gpu_hours: number;
  active_runs: number;
};

export type ResearchRun = {
  slug: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'PLANNED' | 'ARCHIVED';
  gpu_hours?: number;
  contributors_count?: number;
  progress_pct?: number;
};

export type ModelRelease = {
  id: string;
  name: string;
  description: string;
  status: 'RELEASED' | 'IN RESEARCH' | 'PLANNED';
  contributors?: number;
  gpu_hours?: number;
};

export type WorkerRow = {
  id: string;
  gpu: string;
  vram: number;
  gpu_hours: number;
};

export type ActivityEntry = {
  time: string;
  text: string;
};

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 15 } });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export function fetchStats() {
  return get<NetworkStats>('/stats', {
    contributors: 0,
    workers_online: 0,
    gpu_hours: 0,
    active_runs: 0,
  });
}

export function fetchRuns() {
  return get<ResearchRun[]>('/research-runs', []);
}

export function fetchModels() {
  return get<ModelRelease[]>('/models', []);
}

export function fetchWorkers() {
  return get<WorkerRow[]>('/workers', []);
}

export function fetchContributors() {
  return get<Array<{ id: string }>>('/workers', []);
}
