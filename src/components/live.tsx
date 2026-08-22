'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Stats = { contributors: number; gpu_hours: number; workers_online: number; active_runs: number };

export function LiveStats() {
  const [s, setS] = useState<Stats | null>(null);
  useEffect(() => {
    fetch(`${API}/stats`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setS)
      .catch(() => {});
  }, []);

  const cells = [
    ['Contributors', s ? s.contributors : '—'],
    ['GPU hours', s ? s.gpu_hours.toLocaleString() : '—'],
    ['Workers online', s ? s.workers_online : '—'],
    ['Active runs', s ? s.active_runs : '—'],
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-12">
      {cells.map(([label, val]) => (
        <div key={label}>
          <div className="text-3xl font-bold text-accent mb-2">{val}</div>
          <div className="text-muted">{label}</div>
        </div>
      ))}
    </div>
  );
}

type Run = { slug: string; name: string; description: string; status: string };

export function LiveRuns() {
  const [runs, setRuns] = useState<Run[] | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch(`${API}/research-runs`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setRuns)
      .catch(() => setErr(true));
  }, []);

  if (err) return <p className="text-muted">Research index temporarily unavailable.</p>;
  if (!runs) return <p className="text-muted">Loading…</p>;
  if (runs.length === 0)
    return <p className="text-muted">No research runs announced yet. The first community runs are being prepared.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {runs.map((run) => (
        <div key={run.slug} className="bg-card rounded-lg p-6">
          <div className="text-3xl font-bold text-accent mb-2">{run.slug.toUpperCase()}</div>
          <h3 className="font-bold mb-2">{run.name}</h3>
          <p className="text-muted text-sm mb-4">{run.description}</p>
          <span className="text-sm px-2 py-1 rounded bg-surface text-muted">{run.status}</span>
        </div>
      ))}
    </div>
  );
}
