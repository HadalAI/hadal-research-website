'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Stats = { contributors: number; gpu_hours: number; workers_online: number; active_runs: number };

function useStats() {
  const [s, setS] = useState<Stats | null>(null);
  useEffect(() => {
    fetch(`${API}/stats`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setS)
      .catch(() => {});
  }, []);
  return s;
}

function Cell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-2xl px-6 py-5 text-center">
      <div className="text-3xl font-semibold tracking-tight text-white tabular-nums">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-[#8b93a1]">{label}</div>
    </div>
  );
}

export function LiveStats() {
  const s = useStats();
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Cell label="Contributors" value={s ? s.contributors.toLocaleString() : '—'} />
      <Cell label="GPU hours" value={s ? s.gpu_hours.toLocaleString() : '—'} />
      <Cell label="Workers online" value={s ? s.workers_online.toLocaleString() : '—'} />
      <Cell label="Active runs" value={s ? s.active_runs.toLocaleString() : '—'} />
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

  if (err) return <p className="text-sm text-[#8b93a1]">Research index temporarily unavailable.</p>;
  if (!runs) return <p className="animate-pulse text-sm text-[#8b93a1]">Loading…</p>;
  if (runs.length === 0)
    return <p className="text-sm text-[#8b93a1]">No research runs announced yet.</p>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {runs.map((run) => (
        <div key={run.slug} className="glass group rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-[#6881a3]">
              {run.slug.toUpperCase()}
            </span>
            <span className="rounded-full border border-[#6881a3]/30 bg-[#6881a3]/10 px-2.5 py-0.5 text-xs text-[#9ca5b2]">
              {run.status}
            </span>
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">{run.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#8b93a1]">{run.description}</p>
        </div>
      ))}
    </div>
  );
}

export function LiveModels() {
  const [models, setModels] = useState<Array<{ id: string; name: string; description: string; status: string }> | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch(`${API}/models`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setModels)
      .catch(() => setErr(true));
  }, []);

  if (err) return <p className="text-sm text-[#8b93a1]">Model index temporarily unavailable.</p>;
  if (!models) return <p className="animate-pulse text-sm text-[#8b93a1]">Loading…</p>;
  if (models.length === 0)
    return <p className="text-sm text-[#8b93a1]">No models released yet. The first community-trained release is in preparation.</p>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {models.map((m) => (
        <div key={m.id} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-[#6881a3]">{m.name}</span>
            <span className="rounded-full border border-[#6881a3]/30 bg-[#6881a3]/10 px-2.5 py-0.5 text-xs text-[#9ca5b2]">
              {m.status}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#8b93a1]">{m.description}</p>
        </div>
      ))}
    </div>
  );
}

export function Leaderboard() {
  const [rows, setRows] = useState<Array<{ id: string; gpu: string; vram: number; gpu_hours: number }> | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch(`${API}/workers`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setRows)
      .catch(() => setErr(true));
  }, []);

  if (err) return <p className="text-sm text-[#8b93a1]">Leaderboard temporarily unavailable.</p>;
  if (!rows) return <p className="animate-pulse text-sm text-[#8b93a1]">Loading…</p>;
  if (rows.length === 0)
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm text-[#8b93a1]">
          No contributions recorded yet — be the first to put your GPU on the board.
        </p>
        <Link href="/contribute" className="mt-4 inline-block text-sm text-[#9ca5b2] underline-offset-4 hover:text-white hover:underline">
          Start contributing →
        </Link>
      </div>
    );

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-left text-xs uppercase tracking-widest text-[#8b93a1]">
            <th className="px-6 py-4 font-medium">#</th>
            <th className="px-6 py-4 font-medium">Worker</th>
            <th className="px-6 py-4 font-medium">GPU</th>
            <th className="px-6 py-4 text-right font-medium">GPU hours</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((w, i) => (
            <tr key={w.id} className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]">
              <td className="px-6 py-4 font-mono text-[#6881a3]">{String(i + 1).padStart(2, '0')}</td>
              <td className="px-6 py-4 font-mono text-white">{w.id}</td>
              <td className="px-6 py-4 text-[#8b93a1]">{w.gpu}{w.vram ? ` · ${w.vram.toFixed(0)}GB` : ''}</td>
              <td className="px-6 py-4 text-right font-mono tabular-nums text-white">{w.gpu_hours.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
