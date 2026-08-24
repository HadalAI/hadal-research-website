'use client';

import { useCallback, useEffect, useState } from 'react';
import { getToken } from '@/components/sign-in';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type MyDataset = {
  id: string;
  name: string;
  url: string;
  description: string;
  status: string;
  created_at: number;
};

const inputCls =
  'w-full rounded-lg border border-[#161a1e] bg-[#030405] px-3.5 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61] focus:border-[#3d434b] focus:outline-none';

export default function DatasetContribute() {
  const [mine, setMine] = useState<MyDataset[]>([]);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [form, setForm] = useState({ name: '', url: '', description: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const auth = useCallback(
    () => ({ headers: { Authorization: `Bearer ${getToken()}` } }),
    [],
  );

  useEffect(() => {
    if (!getToken()) {
      setSignedIn(false);
      return;
    }
    setSignedIn(true);
    fetch(`${API}/account/datasets`, auth())
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setMine)
      .catch(() => setSignedIn(false));
  }, [auth]);

  const submit = async () => {
    if (!form.name.trim()) return;
    setBusy(true);
    setErr('');
    setMsg('');
    const res = await fetch(`${API}/datasets/submit`, {
      method: 'POST',
      ...auth(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) {
      const j = await res.json();
      setMsg(`Submitted — under review as #${j.id}`);
      setForm({ name: '', url: '', description: '' });
      fetch(`${API}/account/datasets`, auth())
        .then((r) => r.json())
        .then(setMine)
        .catch(() => {});
    } else {
      try {
        setErr((await res.json()).detail || 'Submission failed');
      } catch {
        setErr(`Submission failed (${res.status})`);
      }
    }
  };

  if (signedIn === null) return null;

  return (
    <div className="mt-6 max-w-xl">
      {signedIn ? (
        <>
          <div className="grid gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Dataset name"
              className={inputCls}
            />
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="Link (HF dataset, GitHub, CSV...)"
              className={inputCls}
            />
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is it? (one line)"
              className={inputCls}
            />
          </div>
          <button
            onClick={submit}
            disabled={busy || !form.name.trim()}
            className="btn btn-primary mt-4 disabled:opacity-50"
          >
            {busy ? 'Submitting…' : 'Submit dataset →'}
          </button>
          {msg ? <p className="mt-3 font-mono text-xs text-emerald-500">{msg}</p> : null}
          {err ? <p className="mt-3 font-mono text-xs text-red-500">{err}</p> : null}

          {mine.length > 0 && (
            <div className="mt-8">
              <p className="mono-label mb-3">YOUR SUBMISSIONS</p>
              <div className="space-y-2">
                {mine.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-[#161a1e] bg-[#07090b] px-4 py-2.5"
                  >
                    <span className="truncate font-mono text-xs text-[#f5f5f2]">{d.name}</span>
                    <span
                      className={`shrink-0 font-mono text-[10px] ${
                        d.status === 'APPROVED'
                          ? 'text-emerald-500'
                          : d.status === 'REJECTED'
                            ? 'text-red-500'
                            : 'text-[#8c9197]'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="font-mono text-xs leading-relaxed text-[#555b61]">
          Sign in first (top right), then come back to submit datasets. Every submission is
          reviewed by an admin before it joins the shared shelf.
        </p>
      )}
    </div>
  );
}
