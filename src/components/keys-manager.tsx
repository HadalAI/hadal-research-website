'use client';

import { useCallback, useEffect, useState } from 'react';
import { getToken } from '@/components/sign-in';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type KeyRow = { key: string; label: string; created_at: number | null };

/** Multi-key manager: create labeled worker keys, reveal once, delete anytime. */
export default function KeysManager() {
  const [keys, setKeys] = useState<KeyRow[] | null>(null);
  const [label, setLabel] = useState('');
  const [creating, setCreating] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API}/account/keys`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setKeys)
      .catch(() => setKeys([]));
  }, []);
  useEffect(load, [load]);

  const create = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API}/account/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ label }),
      });
      if (res.ok) {
        setLabel('');
        load();
      }
    } finally {
      setCreating(false);
    }
  };

  const remove = async (key: string) => {
    await fetch(`${API}/account/keys/${key}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    load();
  };

  const copy = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setRevealed((r) => ({ ...r, [key]: true }));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Key label (e.g. gaming-pc)"
          className="w-56 rounded-lg border border-[#161a1e] bg-[#07090b] px-4 py-2.5 font-mono text-xs text-[#f5f5f2] placeholder:text-[#555b61] focus:border-[#3d434b] focus:outline-none"
          maxLength={40}
        />
        <button
          onClick={create}
          disabled={creating || !label.trim()}
          className="btn btn-primary !px-5 !py-2.5 disabled:opacity-40"
        >
          Create key
        </button>
      </div>

      {keys === null ? (
        <p className="text-xs text-[#555b61]">Loading…</p>
      ) : keys.length === 0 ? (
        <p className="rounded-xl border border-[#161a1e] bg-[#07090b] p-6 text-xs text-[#8c9197]">
          No worker keys yet. Create one above — each machine gets its own key so you can revoke them individually.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#161a1e]">
          {keys.map((k, i) => (
            <div
              key={k.key}
              className={`flex flex-wrap items-center gap-4 bg-[#07090b] px-5 py-4 ${i > 0 ? 'border-t border-[#161a1e]' : ''}`}
            >
              <span className="min-w-32 text-sm text-[#f5f5f2]">{k.label || 'unnamed'}</span>
              <code className="min-w-0 flex-1 truncate rounded border border-[#161a1e] bg-black/50 px-3 py-1.5 font-mono text-[11px] text-[#8c9197]">
                {revealed[k.key] ? k.key : `${k.key.slice(0, 6)}${'•'.repeat(18)}${k.key.slice(-4)}`}
              </code>
              <button
                onClick={() => copy(k.key)}
                className="font-mono text-[10px] uppercase tracking-widest text-[#5b8fa8] hover:text-white"
              >
                {copied === k.key ? 'Copied ✓' : 'Copy'}
              </button>
              <button
                onClick={() => remove(k.key)}
                className="font-mono text-[10px] uppercase tracking-widest text-[#555b61] transition-colors hover:text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-[#555b61]">
        Paste a key into hadal-worker on one machine. Deleting a key unlinks its machines at next heartbeat.
      </p>
    </div>
  );
}