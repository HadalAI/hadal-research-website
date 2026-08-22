'use client';

import { useCallback, useEffect, useState } from 'react';

type User = { id: string; username: string; avatar_url: string; github_id: string | null; discord_id: string | null };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** Sign-in control: shows GitHub/Discord buttons when logged out, user chip + logout when in. */
export default function SignIn() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch(`${API}/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);
  // re-check auth when returning from OAuth redirect
  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    if (window.location.hash.includes('auth=ok')) {
      history.replaceState(null, '', window.location.pathname);
      setTimeout(load, 300);
    }
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
        <a href="/dashboard" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-[#d9d9d4]">
          Dashboard
        </a>
        <span className="text-sm text-[#f5f5f2]">{user.username}</span>
        <button
          onClick={() =>
            fetch(`${API}/logout`, { method: 'POST', credentials: 'include' }).then(load)
          }
          className="font-mono text-[11px] uppercase tracking-widest text-[#555b61] transition-colors hover:text-[#f5f5f2]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`${API}/auth/github/start`}
        className="flex items-center gap-2 rounded-lg border border-[#161a1e] px-3 py-1.5 text-xs text-[#c9cdd2] transition-colors duration-200 hover:border-[#3d434b] hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
        </svg>
        GitHub
      </a>
      <a
        href={`${API}/auth/discord/start`}
        className="flex items-center gap-2 rounded-lg border border-[#161a1e] px-3 py-1.5 text-xs text-[#c9cdd2] transition-colors duration-200 hover:border-[#3d434b] hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.26a18.27 18.27 0 0 0-5.48 0 12 12 0 0 0-.62-1.26.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.04.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.05 19.9 19.9 0 0 0 6 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.22-2a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.89.08.08 0 0 1-.01-.13l.37-.29a.07.07 0 0 1 .08-.01 14.2 14.2 0 0 0 12.06 0 .07.07 0 0 1 .08.01l.37.29a.08.08 0 0 1-.01.13c-.6.35-1.22.64-1.87.89a.08.08 0 0 0-.04.11c.36.7.77 1.37 1.22 2a.08.08 0 0 0 .08.03 19.84 19.84 0 0 0 6.02-3.03.08.08 0 0 0 .03-.05c.5-5.18-.84-9.68-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.22 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42z" />
        </svg>
        Discord
      </a>
    </div>
  );
}