'use client';

import { useCallback, useEffect, useState } from 'react';
import KeysManager from '@/components/keys-manager';
import ActivityFeed from '@/components/activity-feed';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Me = { id: string; username: string; avatar_url: string };
type WorkerRow = { id: string; gpu: string; vram: number; name: string; paused: number; last_seen: number | null; gpu_hours: number };

function fmtSeen(ts: number | null) {
  if (!ts) return 'never';
  const s = Math.floor(Date.now() / 1000 - ts);
  if (s < 90) return `${s}s ago`;
  if (s < 5400) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-[#161a1e] bg-[#07090b] p-5">
      <p className="mono-label mb-3">{label}</p>
      <p className="tabular font-mono text-2xl text-[#f5f5f2]">{value}</p>
      {sub ? <p className="mt-1 text-xs text-[#555b61]">{sub}</p> : null}
    </div>
  );
}

export default function DashboardClient() {
  const [me, setMe] = useState<Me | null>(null);
  const [workers, setWorkers] = useState<WorkerRow[]>([]);
  const [stats, setStats] = useState<{ active_runs: number; contributors: number; workers_online: number; gpu_hours: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch(`${API}/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((u) => {
        setMe(u);
        return fetch(`${API}/account/key`, { method: 'POST', credentials: 'include' });
      })
      .then((r) => r.json())
      .then(({ api_key }) =>
        fetch(`${API}/account/workers`, { headers: { 'X-Worker-Key': api_key }, credentials: 'include' })
      )
      .then((r) => r.json())
      .then(setWorkers)
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
    fetch(`${API}/stats`).then((r) => r.json()).then(setStats).catch(() => {});
  }, []);
  useEffect(load, [load]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 pb-32">
        <p className="mono-label pt-20">CONTRIBUTOR CONSOLE</p>
        <p className="mt-6 animate-pulse text-sm text-[#555b61]">Loading…</p>
      </main>
    );
  }

  if (!me) {
    return (
      <main className="mx-auto max-w-6xl px-6 pb-32">
        <p className="mono-label pt-20">CONTRIBUTOR CONSOLE</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Sign in required</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8c9197]">
          Sign in with GitHub or Discord using the buttons top right — then this
          console opens: worker keys, linked machines, hours.
        </p>
        <div className="mt-10 grid max-w-lg grid-cols-2 gap-px bg-[#161a1e] font-mono text-xs">
          <div className="bg-[#07090b] px-5 py-4 text-[#8c9197]">MANAGE KEYS</div>
          <div className="bg-[#07090b] px-5 py-4 text-[#8c9197]">LINK MACHINES</div>
          <div className="bg-[#07090b] px-5 py-4 text-[#8c9197]">TRACK HOURS</div>
          <div className="bg-[#07090b] px-5 py-4 text-[#8c9197]">LEADERBOARD</div>
        </div>
      </main>
    );
  }

  const totalHours = workers.reduce((a, w) => a + w.gpu_hours, 0);
  const online = workers.filter((w) => w.last_seen && Date.now() / 1000 - w.last_seen < 300).length;

  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <div className="flex flex-wrap items-center justify-between gap-4 pt-16">
        <div>
          <p className="mono-label">CONTRIBUTOR CONSOLE</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Welcome back, <span className="text-[#8c9197]">{me.username}</span>
          </h1>
        </div>
        <Link href="/contribute" className="btn btn-primary">Add machine →</Link>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Your GPU hours" value={totalHours.toFixed(2)} sub={`${workers.length} machine${workers.length === 1 ? '' : 's'} linked`} />
        <StatCard label="Workers online" value={`${online}/${workers.length}`} sub="last 5 min" />
        <StatCard label="Network GPU hours" value={(stats?.gpu_hours ?? 0).toLocaleString()} sub="all contributors" />
        <StatCard label="Network contributors" value={(stats?.contributors ?? 0).toLocaleString()} sub={`${stats?.workers_online ?? 0} online now`} />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-14">
          <section>
            <h2 className="mb-1 text-lg font-medium text-[#f5f5f2]">Linked machines</h2>
            <p className="mb-5 text-xs text-[#555b61]">Every machine running hadal-worker under your account.</p>
            {workers.length === 0 ? (
              <div className="rounded-xl border border-[#161a1e] bg-[#07090b] p-10 text-center font-mono text-xs text-[#8c9197]">
                No machines yet. Create a key below, then run hadal-worker and paste it in.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-[#161a1e]">
                {workers.map((w, i) => (
                  <div key={w.id} className={`grid grid-cols-2 items-center gap-4 bg-[#07090b] px-5 py-4 md:grid-cols-5 ${i > 0 ? 'border-t border-[#161a1e]' : ''}`}>
                    <span className="text-sm text-[#f5f5f2]">{w.name || w.id}</span>
                    <span className="font-mono text-xs text-[#8c9197]">{w.gpu}{w.vram ? ` · ${w.vram.toFixed(0)}GB` : ''}</span>
                    <span className={`font-mono text-[11px] ${w.paused ? 'text-[#555b61]' : 'text-emerald-500'}`}>
                      {w.paused ? 'PAUSED' : 'CONTRIBUTING'}
                    </span>
                    <span className="font-mono text-xs tabular text-[#8c9197]">{w.gpu_hours.toFixed(2)} H</span>
                    <span className="text-right font-mono text-[11px] text-[#555b61]">{fmtSeen(w.last_seen)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-1 text-lg font-medium text-[#f5f5f2]">Worker keys</h2>
            <p className="mb-5 text-xs text-[#555b61]">One key per machine. Delete a key to unlink that machine at its next heartbeat.</p>
            <KeysManager />
          </section>

          <section>
            <h2 className="mb-1 text-lg font-medium text-[#f5f5f2]">Link a new machine</h2>
            <div className="mt-4 space-y-3 rounded-xl border border-[#161a1e] bg-[#07090b] p-6 font-mono text-xs">
              <p><span className="text-[#555b61]">$</span> pip install hadal-worker</p>
              <p><span className="text-[#555b61]">$</span> hadal-worker</p>
              <p className="text-[#8c9197]">Paste any active key when prompted.</p>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-[#161a1e] bg-[#07090b] p-5">
            <h3 className="mb-4 text-sm font-medium text-[#f5f5f2]">Network status</h3>
            <dl className="space-y-3 font-mono text-xs">
              <div className="flex justify-between"><dt className="text-[#555b61]">ACTIVE RUNS</dt><dd className="tabular text-[#f5f5f2]">{stats?.active_runs ?? '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-[#555b61]">CONTRIBUTORS</dt><dd className="tabular text-[#f5f5f2]">{(stats?.contributors ?? 0).toLocaleString()}</dd></div>
              <div className="flex justify-between"><dt className="text-[#555b61]">ONLINE NOW</dt><dd className="tabular text-emerald-500">{stats?.workers_online ?? 0}</dd></div>
              <div className="flex justify-between"><dt className="text-[#555b61]">TOTAL HOURS</dt><dd className="tabular text-[#f5f5f2]">{(stats?.gpu_hours ?? 0).toLocaleString()}</dd></div>
            </dl>
            <a href="/models" className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#5b8fa8] hover:text-white">
              Leaderboard →
            </a>
          </div>
          <ActivityFeed limit={5} />
        </aside>
      </div>
    </main>
  );
}
