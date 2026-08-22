import { cookies } from 'next/headers';

export const metadata = { title: 'Dashboard — Hadal Research' };

type WorkerRow = { id: string; gpu: string; vram: number; name: string; paused: number; last_seen: number | null; gpu_hours: number };
type Me = { id: string; username: string; avatar_url: string };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getMe(): Promise<Me | null> {
  const c = await cookies();
  const token = c.get('hadal_session')?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API}/me`, {
      headers: { Cookie: `hadal_session=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getWorkers(me: Me | null): Promise<WorkerRow[]> {
  if (!me) return [];
  try {
    const c = await cookies();
    const token = c.get('hadal_session')?.value!;
    const keyRes = await fetch(`${API}/account/key`, {
      method: 'POST',
      headers: { Cookie: `hadal_session=${token}` },
      cache: 'no-store',
    });
    if (!keyRes.ok) return [];
    const { api_key } = await keyRes.json();
    const res = await fetch(`${API}/account/workers`, {
      headers: { 'X-Worker-Key': api_key },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function fmtSeen(ts: number | null) {
  if (!ts) return 'never';
  const s = Math.floor(Date.now() / 1000 - ts);
  if (s < 90) return `${s}s ago`;
  if (s < 5400) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export default async function DashboardPage() {
  const me = await getMe();
  const workers = await getWorkers(me);

  if (!me) {
    return (
      <main className="mx-auto max-w-6xl px-6 pb-32">
        <p className="mono-label pt-20">CONTRIBUTOR CONSOLE</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Sign in required</h1>
        <p className="mt-4 max-w-md text-sm text-[#8c9197]">
          Sign in with GitHub or Discord (top right), then link your machines with your personal worker key.
        </p>
        <div className="mt-8 rounded-xl border border-[#161a1e] bg-[#07090b] p-6 font-mono text-xs text-[#8c9197]">
          $ pip install hadal-worker && hadal-worker
        </div>
      </main>
    );
  }

  const totalHours = workers.reduce((a, w) => a + w.gpu_hours, 0);
  const online = workers.filter((w) => w.last_seen && Date.now() / 1000 - w.last_seen < 300).length;

  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <p className="mono-label pt-20">CONTRIBUTOR CONSOLE</p>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">
        Welcome back{me.username ? ', ' : ''}
        {me.username ? <span className="text-[#8c9197]">{me.username}</span> : null}
      </h1>

      <div className="mt-12 grid grid-cols-3 gap-px bg-[#161a1e] font-mono">
        <div className="bg-[#030405] px-6 py-5">
          <p className="mono-label mb-2">GPU HOURS TOTAL</p>
          <p className="tabular text-2xl text-[#f5f5f2]">{totalHours.toFixed(2)}</p>
        </div>
        <div className="bg-[#030405] px-6 py-5">
          <p className="mono-label mb-2">WORKERS ONLINE</p>
          <p className="tabular text-2xl text-[#f5f5f2]">{online} / {workers.length}</p>
        </div>
        <div className="bg-[#030405] px-6 py-5">
          <p className="mono-label mb-2">LINKED MACHINES</p>
          <p className="tabular text-2xl text-[#f5f5f2]">{workers.length}</p>
        </div>
      </div>

      <h2 className="mt-16 text-lg font-medium text-[#f5f5f2]">Your Workers</h2>
      {workers.length === 0 ? (
        <div className="mt-4 rounded-xl border border-[#161a1e] bg-[#07090b] p-10 text-center font-mono text-xs text-[#8c9197]">
          No machines linked yet — run hadal-worker anywhere and paste your key.
        </div>
      ) : (
        <div className="border-t hairline font-mono text-xs">
          {workers.map((w) => (
            <div key={w.id} className="record grid grid-cols-2 items-center gap-4 border-b hairline py-4 md:grid-cols-5">
              <span className="text-[#f5f5f2]">{w.name || w.id}</span>
              <span className="text-[#8c9197]">{w.gpu}{w.vram ? ` ${w.vram.toFixed(0)}GB` : ''}</span>
              <span className={w.paused ? 'text-[#8c9197]' : 'text-emerald-500'}>
                {w.paused ? 'PAUSED' : 'CONTRIBUTING'}
              </span>
              <span className="tabular text-[#8c9197]">{w.gpu_hours.toFixed(2)} H</span>
              <span className="text-[#555b61]">seen {fmtSeen(w.last_seen)}</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-16 text-lg font-medium text-[#f5f5f2]">Link a new machine</h2>
      <div className="mt-4 space-y-3 rounded-xl border border-[#161a1e] bg-[#07090b] p-6 font-mono text-xs">
        <p><span className="text-[#555b61]">$</span> pip install hadal-worker</p>
        <p><span className="text-[#555b61]">$</span> hadal-worker</p>
        <p className="text-[#8c9197]">Paste your worker key when asked. Keys rotate from this dashboard.</p>
      </div>
    </main>
  );
}
