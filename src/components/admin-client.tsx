'use client';

import { useCallback, useEffect, useState } from 'react';
import { getToken } from '@/components/sign-in';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Me = { username: string; is_admin: boolean };
type UserRow = { id: string; username: string; is_admin: number; created_at: number };
type Dataset = { id: string; name: string; url: string; description: string; status: string };
type JobRow = {
  id: string;
  run_slug: string;
  shard_index: number;
  status: string;
  worker_id: string | null;
  created_at: number;
};
type RunProgress = { total: number; done: number; pending: number; assigned: number; pct: number };

const fmtDate = (ts: number) =>
  new Date(ts * 1000).toISOString().slice(0, 16).replace('T', ' ');

function Card({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#161a1e] bg-[#07090b]">
      <div className="flex items-center justify-between border-b border-[#161a1e] px-5 py-3.5">
        <h2 className="text-sm font-medium text-[#f5f5f2]">{title}</h2>
        {badge}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

const inputCls =
  'w-full rounded-lg border border-[#161a1e] bg-[#030405] px-3.5 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61] focus:border-[#3d434b] focus:outline-none';

export default function AdminClient() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [hf, setHf] = useState<{ connected: boolean; org?: string } | null>(null);
  const [hfOrg, setHfOrg] = useState('');
  const [hfToken, setHfToken] = useState('');
  const [train, setTrain] = useState({ name: '', base_model: '', dataset_id: '', notes: '' });
  const [msg, setMsg] = useState('');
  const [hfErr, setHfErr] = useState('');
  const [shards, setShards] = useState(5);
  const [progress, setProgress] = useState<Record<string, RunProgress>>({});
  const [busy, setBusy] = useState('');

  const auth = useCallback(
    () => ({ headers: { Authorization: `Bearer ${getToken()}` } }),
    [],
  );

  const loadJobs = useCallback(
    (slug?: string) => {
      const url = slug ? `${API}/admin/jobs?run_slug=${encodeURIComponent(slug)}` : `${API}/admin/jobs`;
      fetch(url, auth())
        .then((r) => r.json())
        .then(async (list: JobRow[]) => {
          setJobs(list);
          // per-run progress for each distinct run
          const slugs = [...new Set(list.map((j) => j.run_slug))];
          const entries = await Promise.all(
            slugs.map((s) =>
              fetch(`${API}/jobs/progress/${s}`)
                .then((r) => r.json())
                .then((p) => [s, p] as const)
                .catch(() => null),
            ),
          );
          setProgress(Object.fromEntries(entries.filter(Boolean) as [string, RunProgress][]));
        })
        .catch(() => {});
    },
    [auth],
  );

  const load = useCallback(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/admin/me`, { ...auth() })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((u) => {
        setMe(u);
        if (!u.is_admin) return null;
        return Promise.all([
          fetch(`${API}/admin/users`, auth()).then((r) => r.json()),
          fetch(`${API}/admin/datasets`, auth()).then((r) => r.json()),
          fetch(`${API}/admin/hf`, auth()).then((r) => r.json()),
        ]);
      })
      .then((data) => {
        if (!data) return;
        const [us, ds, h] = data;
        setUsers(us);
        setDatasets(ds);
        setHf(h);
        loadJobs();
      })
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, [auth, loadJobs]);
  useEffect(load, [load]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 pb-32">
        <p className="mono-label pt-20">ADMIN</p>
        <p className="mt-6 animate-pulse text-sm text-[#555b61]">Checking access…</p>
      </main>
    );
  }
  if (!me || !me.is_admin) {
    return (
      <main className="mx-auto max-w-6xl px-6 pb-32">
        <p className="mono-label pt-20">ADMIN</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          {me ? '403' : 'Sign in required'}
        </h1>
        <p className="mt-4 text-sm text-[#8c9197]">
          {me ? 'This area is restricted to admins.' : 'Sign in top right first.'}
        </p>
      </main>
    );
  }

  const review = async (id: string, action: string) => {
    setBusy(id + action);
    await fetch(`${API}/admin/datasets/${id}/${action}`, { method: 'POST', ...auth() });
    setBusy('');
    load();
  };
  const toggleAdmin = async (userId: string, current: number) => {
    setBusy(userId);
    await fetch(`${API}/admin/users/${userId}/admin`, {
      method: 'POST',
      ...auth(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: current ? '0' : '1' }),
    });
    setBusy('');
    load();
  };
  const connectHf = async () => {
    setBusy('hf');
    setHfErr('');
    const res = await fetch(`${API}/admin/hf`, {
      method: 'POST',
      ...auth(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ org: hfOrg, token: hfToken }),
    });
    setBusy('');
    if (res.ok) {
      setHfToken('');
      // re-read connected state immediately so the badge flips without a reload
      fetch(`${API}/admin/hf`, auth()).then((r) => r.json()).then(setHf).catch(() => {});
    } else {
      try {
        setHfErr((await res.json()).detail || 'Connection failed');
      } catch {
        setHfErr(`Connection failed (${res.status})`);
      }
    }
  };
  const createJobs = async () => {
    const slug = train.name.toLowerCase().replace(/ /g, '-');
    if (!slug) return;
    setBusy('jobs');
    const res = await fetch(`${API}/admin/jobs/create`, {
      method: 'POST',
      ...auth(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        run_slug: slug,
        base_model: train.base_model,
        dataset_url: train.dataset_id,
        shard_total: shards,
      }),
    });
    const j = await res.json();
    setBusy('');
    setMsg(res.ok ? `Created ${j.jobs.length} shard jobs for ${j.run}` : j.detail || 'failed');
    loadJobs(slug);
  };

  const pendingCount = datasets.filter((d) => d.status === 'PENDING').length;
  const runsList = Object.entries(progress);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-32 sm:px-6">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pt-10 sm:pt-16">
        <div>
          <p className="mono-label">ADMIN CONSOLE</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Admin — {me.username}
          </h1>
        </div>
        <div className="flex gap-6 font-mono text-xs text-[#555b61]">
          <span>
            <b className="tabular text-sm text-[#f5f5f2]">{users.length}</b> users
          </span>
          <span>
            <b className="tabular text-sm text-[#f5f5f2]">{datasets.length}</b> datasets
          </span>
          <span>
            <b className="tabular text-sm text-[#f5f5f2]">{jobs.length}</b> jobs
          </span>
        </div>
      </div>

      {/* quick stats row */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Runs with jobs', String(runsList.length)],
          ['Shards total', String(runsList.reduce((n, [, p]) => n + p.total, 0))],
          ['Shards done', String(runsList.reduce((n, [, p]) => n + p.done, 0))],
          ['Pending datasets', String(pendingCount)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#161a1e] bg-[#07090b] p-4">
            <p className="mono-label !text-[10px]">{label}</p>
            <p className="tabular mt-1.5 font-mono text-xl text-[#f5f5f2]">{value}</p>
          </div>
        ))}
      </div>

      {/* LAUNCH RUN */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card title="Launch training run">
          <div className="grid gap-3">
            <input value={train.name} onChange={(e) => setTrain({ ...train, name: e.target.value })} placeholder="Run name (e.g. SLM Reasoning v2)" className={inputCls} />
            <input value={train.base_model} onChange={(e) => setTrain({ ...train, base_model: e.target.value })} placeholder="Base model (HF id)" className={inputCls} />
            <input value={train.dataset_id} onChange={(e) => setTrain({ ...train, dataset_id: e.target.value })} placeholder="Dataset URL or ID" className={inputCls} />
            <input value={train.notes} onChange={(e) => setTrain({ ...train, notes: e.target.value })} placeholder="Notes" className={inputCls} />
          </div>
          <button onClick={createJobs} disabled={busy === 'jobs'} className="btn btn-primary mt-4 w-full sm:w-auto disabled:opacity-50">
            {busy === 'jobs' ? 'Distributing…' : `Launch + distribute ${shards} shards →`}
          </button>
          {msg ? <p className="mt-3 font-mono text-xs text-emerald-500">{msg}</p> : null}
        </Card>

        {/* HF */}
        <Card
          title="Hugging Face"
          badge={
            <span className={`font-mono text-[11px] ${hf?.connected ? 'text-emerald-500' : 'text-[#555b61]'}`}>
              {hf?.connected ? `CONNECTED / ${hf.org}` : 'NOT CONNECTED'}
            </span>
          }
        >
          <p className="mb-4 text-xs leading-relaxed text-[#555b61]">
            Artifacts (adapters, eval results) upload to your org&apos;s HF repos. Storage only —
            training happens on workers.
          </p>
          <div className="grid gap-3">
            <input value={hfOrg} onChange={(e) => setHfOrg(e.target.value)} placeholder="Org (hadal-research)" className={inputCls} />
            <input value={hfToken} onChange={(e) => setHfToken(e.target.value)} placeholder="Write token (hf_...)" type="password" className={inputCls} />
          </div>
          <button onClick={connectHf} disabled={busy === 'hf' || !hfOrg || !hfToken} className="btn btn-ghost mt-4 w-full sm:w-auto disabled:opacity-50">
            {busy === 'hf' ? 'Validating…' : 'Connect'}
          </button>
          {hfErr ? <p className="mt-3 font-mono text-xs text-red-500">{hfErr}</p> : null}
        </Card>
      </div>

      {/* RUN PROGRESS */}
      <div className="mt-6">
        <Card title="Run progress">
          {runsList.length === 0 ? (
            <p className="font-mono text-xs text-[#555b61]">No shard jobs yet — launch a run above.</p>
          ) : (
            <div className="space-y-5">
              {runsList.map(([slug, p]) => (
                <div key={slug}>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <button onClick={() => loadJobs(slug)} className="text-[#f5f5f2] hover:underline">{slug}</button>
                    <span className="tabular text-[#555b61]">
                      {p.done}/{p.total} done · {p.pending} pending · {p.assigned} assigned
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#161a1e]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#7dd3fc]"
                      style={{ width: `${Math.max(p.pct, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
              {jobs[0]?.run_slug && progress[jobs[0].run_slug] && (
                <button onClick={() => loadJobs()} className="font-mono text-[11px] text-[#5b8fa8] hover:underline">
                  Show all recent jobs →
                </button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* JOBS TABLE */}
      {jobs.length > 0 && (
        <div className="mt-6">
          <Card title={`Recent shard jobs (${jobs.length})`}>
            <div className="-mx-5 overflow-x-auto px-5">
              <table className="w-full min-w-[560px] font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#161a1e] text-left text-[#555b61]">
                    <th className="pb-2 pr-4 font-normal">JOB</th>
                    <th className="pb-2 pr-4 font-normal">RUN</th>
                    <th className="pb-2 pr-4 font-normal">SHARD</th>
                    <th className="pb-2 pr-4 font-normal">STATUS</th>
                    <th className="pb-2 font-normal">WORKER</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice(0, 20).map((j) => (
                    <tr key={j.id} className="border-b border-[#161a1e]/50 last:border-0">
                      <td className="py-2.5 pr-4 text-[#8c9197]">{j.id}</td>
                      <td className="py-2.5 pr-4 text-[#f5f5f2]">{j.run_slug}</td>
                      <td className="tabular py-2.5 pr-4 text-[#8c9197]">#{j.shard_index}</td>
                      <td className="py-2.5 pr-4">
                        <span
                          className={
                            j.status === 'DONE'
                              ? 'text-emerald-500'
                              : j.status === 'FAILED'
                                ? 'text-red-500'
                                : j.status === 'ASSIGNED'
                                  ? 'text-sky-400'
                                  : 'text-[#555b61]'
                          }
                        >
                          {j.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-[#8c9197]">{j.worker_id ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* DATASETS */}
      <div className="mt-6">
        <Card
          title="Dataset submissions"
          badge={
            pendingCount > 0 ? (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-500">
                {pendingCount} PENDING
              </span>
            ) : undefined
          }
        >
          {datasets.length === 0 ? (
            <p className="font-mono text-xs text-[#555b61]">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {datasets.map((d) => (
                <div key={d.id} className="flex flex-col gap-3 rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-3 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="truncate text-sm text-[#f5f5f2]">{d.name}</span>
                      <span
                        className={`font-mono text-[10px] ${
                          d.status === 'APPROVED' ? 'text-emerald-500' : d.status === 'REJECTED' ? 'text-red-500' : 'text-[#8c9197]'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    {d.url ? (
                      <a href={d.url} target="_blank" rel="noreferrer" className="mt-0.5 block truncate text-xs text-[#5b8fa8] hover:underline">
                        {d.url}
                      </a>
                    ) : null}
                    {d.description ? <p className="mt-1 truncate text-xs text-[#555b61]">{d.description}</p> : null}
                  </div>
                  {d.status === 'PENDING' ? (
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => review(d.id, 'approve')} disabled={!!busy} className="btn btn-primary !px-3 !py-1 !text-[10px]">Approve</button>
                      <button onClick={() => review(d.id, 'reject')} disabled={!!busy} className="btn btn-ghost !px-3 !py-1 !text-[10px]">Reject</button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* USERS */}
      <div className="mt-6 mb-12">
        <Card title={`Users (${users.length})`}>
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[420px] font-mono text-xs">
              <thead>
                <tr className="border-b border-[#161a1e] text-left text-[#555b61]">
                  <th className="pb-2 pr-4 font-normal">USER</th>
                  <th className="pb-2 pr-4 font-normal">JOINED</th>
                  <th className="pb-2 font-normal">ROLE</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#161a1e]/50 last:border-0">
                    <td className="py-2.5 pr-4 text-[#f5f5f2]">{u.username || u.id.slice(0, 8)}</td>
                    <td className="py-2.5 pr-4 text-[#8c9197]">{fmtDate(u.created_at)}</td>
                    <td className="py-2.5">
                      <button
                        onClick={() => toggleAdmin(u.id, u.is_admin)}
                        disabled={busy === u.id}
                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] transition-colors ${
                          u.is_admin
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                            : 'border-[#161a1e] text-[#555b61] hover:text-white'
                        }`}
                      >
                        {u.is_admin ? 'ADMIN' : 'MAKE ADMIN'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
