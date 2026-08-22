'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const TOKEN_KEY = 'hadal_token';

export function getToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}

type User = { id: string; username: string; avatar_url: string };

/** Sign-in control: GitHub/Discord buttons when logged out; avatar + Dashboard when in. */
export default function SignIn() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    fetch(`${API}/me`, { headers: { Authorization: `Bearer ` + token } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    // returning from OAuth: grab token from URL fragment
    if (window.location.hash.startsWith('#token=')) {
      const token = window.location.hash.slice('#token='.length).split('&')[0];
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        history.replaceState(null, '', window.location.pathname);
        setTimeout(load, 100);
      }
    }
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [load]);

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt="" className="h-6 w-6 rounded-full" />
        ) : null}
        <Link href="/dashboard" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-[#d9d9d4]">
          Dashboard
        </Link>
        <AdminLink />
        <button
          onClick={() => {
            fetch(`${API}/logout`, { method: 'POST' }).catch(() => {});
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
          }}
          className="font-mono text-[11px] uppercase tracking-widest text-[#555b61] transition-colors hover:text-[#f5f5f2]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a href={`${API}/auth/github/start`} className="flex items-center gap-2 rounded-lg border border-[#161a1e] px-3 py-1.5 text-xs text-[#c9cdd2] transition-colors duration-200 hover:border-[#3d434b] hover:text-white">
        GitHub
      </a>
      <a href={`${API}/auth/discord/start`} className="flex items-center gap-2 rounded-lg border border-[#161a1e] px-3 py-1.5 text-xs text-[#c9cdd2] transition-colors duration-200 hover:border-[#3d434b] hover:text-white">
        Discord
      </a>
    </div>
  );
}

function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API}/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((u) => setIsAdmin(!!u.is_admin))
      .catch(() => setIsAdmin(false));
  }, []);
  if (!isAdmin) return null;
  return (
    <Link href="/admin" className="font-mono text-[11px] uppercase tracking-widest text-[#5b8fa8] transition-colors hover:text-white">
      Admin
    </Link>
  );
}