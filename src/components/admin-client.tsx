'use client';

import { useCallback, useEffect, useState } from 'react';
import { getToken } from '@/components/sign-in';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Me = { username: string; is_admin: boolean };
type UserRow = { id: string; username: string; is_admin: number; created_at: number };
type Dataset = { id: string; name: string; url: string; description: string; status: string };

function auth() {
  return { headers: { Authorization: `Bearer ` + getToken() } };
}

export default function AdminClient() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [hf, setHf] = useState<{ connected: boolean; org?: string } | null>(null);
  const [hfOrg, setHfOrg] = useState('');
  const [hfToken, setHfToken] = useState('');
  const [train, setTrain] = useState({ name: '', base_model: '', dataset_id: '', notes: '' });
  const [msg, setMsg] = useState('');
  const [shards, setShards] = useState(5);

  const load = useCallback(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    fetch(`${API}/admin/me`, { ...auth() })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((u) => {
        setMe(u);
        return Promise.all([
          fetch(`${API}/admin/users`, auth()).then((r) => r.json()),
          fetch(`${API}/admin/datasets`, auth()).then((r) => r.json()),
          fetch(`${API}/admin/hf`, auth()).then((r) => r.json()),
        ]);
      })
      .then(([us, ds, h]) => { setUsers(us); setDatasets(ds); setHf(h); })
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  if (loading) {
    return <main className="mx-auto max-w-6xl px-6 pb-32"><p className="mono-label pt-20">ADMIN</p><p className="mt-6 animate-pulse text-sm text-[#555b61]">Checking access…</p></main>;
  }
  if (!me) {
    return <main className="mx-auto max-w-6xl px-6 pb-32"><p className="mono-label pt-20">ADMIN</p><h1 className="mt-6 text-4xl font-semibold tracking-tight">Sign in required</h1><p className="mt-4 text-sm text-[#8c9197]">Sign in top right first.</p></main>;
  }
  if (!me.is_admin) {
    return <main className="mx-auto max-w-6xl px-6 pb-32"><p className="mono-label pt-20">ADMIN</p><h1 className="mt-6 text-4xl font-semibold tracking-tight">403</h1><p className="mt-4 text-sm text-[#8c9197]">This area is restricted to admins.</p></main>;
  }

  const review = async (id: string, action: string) => {
    await fetch(`${API}/admin/datasets/${id}/${action}`, { method: 'POST', ...auth() });
    load();
  };
  const toggleAdmin = async (userId: string, current: number) => {
    await fetch(`${API}/admin/users/${userId}/admin`, {
      method: 'POST', ...auth(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: current ? '0' : '1' }),
    });
    load();
  };
  const connectHf = async () => {
    const res = await fetch(`${API}/admin/hf`, { method: 'POST', ...auth(), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ org: hfOrg, token: hfToken }) });
    if (res.ok) { setHfToken(''); load(); }
  };
  const createJobs = async () => {
    const slug = train.name.toLowerCase().replace(/ /g, '-');
    if (!slug) return;
    const res = await fetch(`${API}/admin/jobs/create`, {
      method: 'POST', ...auth(), headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ run_slug: slug, base_model: train.base_model, dataset_url: train.dataset_id, shard_total: shards }),
    });
    const j = await res.json();
    if (res.ok) setJobsStatus(`Created ${j.jobs.length} shard jobs for ${j.run}`);
    else setJobsStatus(j.detail || 'failed');
  };
  const [jobsStatus, setJobsStatus] = useState('');

  const startTraining = async () => {
    if (!train.name.trim()) return;
    const res = await fetch(`${API}/admin/trainings`, { method: 'POST', ...auth(), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(train) });
    if (res.ok) {
      const j = await res.json();
      setMsg(`Training run created: ${j.slug}`);
      setTrain({ name: '', base_model: '', dataset_id: '', notes: '' });
    }
  };

  const pending = datasets.filter((d) => d.status === 'PENDING');

  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <p className="mono-label pt-16">ADMIN CONSOLE</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Admin — {me.username}</h1>

      {/* TRAINING */}
      <section className="mt-12 rounded-xl border border-[#161a1e] bg-[#07090b] p-6">
        <h2 className="mb-4 text-lg font-medium text-[#f5f5f2]">Start training run</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input value={train.name} onChange={(e) => setTrain({ ...train, name: e.target.value })} placeholder="Run name (e.g. SLM Reasoning v2)" className="rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61] focus:border-[#3d434b] focus:outline-none" />
          <input value={train.base_model} onChange={(e) => setTrain({ ...train, base_model: e.target.value })} placeholder="Base model (HF id)" className="rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61] focus:border-[#3d434b] focus:outline-none" />
          <input value={train.dataset_id} onChange={(e) => setTrain({ ...train, dataset_id: e.target.value })} placeholder="Dataset ID (approved)" className="rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61] focus:border-[#3d434b] focus:outline-none" />
          <input value={train.notes} onChange={(e) => setTrain({ ...train, notes: e.target.value })} placeholder="Notes" className="rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61] focus:border-[#3d434b] focus:outline-none" />
        </div>
        <button onClick={startTraining} className="btn btn-primary mt-4">Launch run →</button>
        {msg ? <p className="mt-3 font-mono text-xs text-emerald-500">{msg}</p> : null}
      </section>

      {/* JOBS */}
      <section className="mt-8 rounded-xl border border-[#161a1e] bg-[#07090b] p-6">
        <h2 className="mb-1 text-lg font-medium text-[#f5f5f2]">Distribute jobs to workers</h2>
        <p className="mb-4 text-xs text-[#555b61]">
          Splits a run into N shards. Each online worker claims one shard, trains on its slice,
          uploads results. Extra workers stay free or pick the next run&apos;s shards.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <p className="mono-label mb-2">Run slug</p>
            <input value={train.name ? train.name.toLowerCase().replace(/ /g, '-') : ''} readOnly
              placeholder="set a run name above" className="w-64 rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61]" />
          </div>
          <div>
            <p className="mono-label mb-2">Workers (shards)</p>
            <input type="number" min={1} max={50} value={shards} onChange={(e) => setShards(parseInt(e.target.value) || 1)}
              className="w-24 rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-2.5 font-mono text-xs text-[#f5f5f2]" />
          </div>
          <button onClick={createJobs} className="btn btn-primary mt-5">Distribute →</button>
        </div>
        {jobsStatus ? <p className="mt-3 font-mono text-xs text-emerald-500">{jobsStatus}</p> : null}
      </section>

      {/* HF */}
      <section className="mt-8 rounded-xl border border-[#161a1e] bg-[#07090b] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-[#f5f5f2]">Hugging Face</h2>
          <span className={`font-mono text-[11px] ${hf?.connected ? 'text-emerald-500' : 'text-[#555b61]'}`}>
            {hf?.connected ? `CONNECTED / ${hf.org}` : 'NOT CONNECTED'}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <input value={hfOrg} onChange={(e) => setHfOrg(e.target.value)} placeholder="Org (hadal-research)" className="w-56 rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61] focus:border-[#3d434b] focus:outline-none" />
          <input value={hfToken} onChange={(e) => setHfToken(e.target.value)} placeholder="Write token (hf_...)" type="password" className="w-64 rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61] focus:border-[#3d434b] focus:outline-none" />
          <button onClick={connectHf} className="btn btn-ghost">Connect</button>
        </div>
      </section>

      {/* DATASETS */}
      <section className="mt-8 rounded-xl border border-[#161a1e] bg-[#07090b] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-[#f5f5f2]">Dataset submissions</h2>
          {pending.length > 0 && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-500">
              {pending.length} PENDING
            </span>
          )}
        </div>
        {datasets.length === 0 ? (
          <p className="mt-4 font-mono text-xs text-[#555b61]">No submissions yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {datasets.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-[#161a1e] bg-[#030405] px-4 py-3">
                <span className="min-w-40 text-sm text-[#f5f5f2]">{d.name}</span>
                <span className={`font-mono text-[10px] ${d.status === 'APPROVED' ? 'text-emerald-500' : d.status === 'REJECTED' ? 'text-red-500' : 'text-[#8c9197]'}`}>{d.status}</span>
                {d.url ? <a href={d.url} target="_blank" rel="noreferrer" className="text-xs text-[#5b8fa8] hover:underline">{d.url}</a> : null}
                <span className="flex-1" />
                {d.status === 'PENDING' ? (
                  <>
                    <button onClick={() => review(d.id, 'approve')} className="btn btn-primary !px-3 !py-1 !text-[10px]">Approve</button>
                    <button onClick={() => review(d.id, 'reject')} className="btn btn-ghost !px-3 !py-1 !text-[10px]">Reject</button>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* USERS */}
      <section className="mt-8 mb-20 rounded-xl border border-[#161a1e] bg-[#07090b] p-6">
        <h2 className="mb-4 text-lg font-medium text-[#f5f5f2]">Users ({users.length})</h2>
        <div className="space-y-2 font-mono text-xs">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between border-b border-[#161a1e]/60 pb-2">
              <span className="text-[#f5f5f2]">{u.username || u.id.slice(0, 8)}</span>
              <button
                onClick={() => toggleAdmin(u.id, u.is_admin)}
                className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] transition-colors ${
                  u.is_admin
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                    : 'border-[#161a1e] text-[#555b61] hover:text-white'
                }`}
              >
                {u.is_admin ? 'ADMIN' : 'MAKE ADMIN'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}