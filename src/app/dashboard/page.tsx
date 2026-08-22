import { cookies } from 'next/headers';
import KeysManager from '@/components/keys-manager';
import ActivityFeed from '@/components/activity-feed';
import { fetchStats } from '@/lib/data';

export const metadata = { title: 'Dashboard — Hadal Research' };

type WorkerRow = { id: string; gpu: string; vram: number; name: string; paused: number; last_seen: number | null; gpu_hours: number };
type Me = { id: string; username: string; avatar_url: string };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getMe(): Promise<Me | null> {
  const c = await cookies();
  const token = c.get('hadal_session')?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API}/me`, { headers: { Cookie: `hadal_session=${token}` }, cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

async function getAccount(me: Me | null): Promise<{ workers: WorkerRow[] }> {
  if (!me) return { workers: [] };
  try {
    const c = await cookies();
    const token = c.get('hadal_session')?.value!;
    const keyRes = await fetch(`${API}/account/key`, {
      method: 'POST', headers: { Cookie: `hadal_session=${token}` }, cache: 'no-store',
    });
    if (!keyRes.ok) return { workers: [] };
    const { api_key } = await keyRes.json();
    const res = await fetch(`${API}/account/workers`, { headers: { 'X-Worker-Key': api_key }, cache: 'no-store' });
    return { workers: res.ok ? await res.json() : [] };
  } catch {
    return { workers: [] };
  }
}

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

export default async function DashboardPage() {
  const [me, stats] = await Promise.all([getMe(), fetchStats()]);
  const { workers } = await getAccount(me);

  if (!me) {
    return (
      <main className="mx-auto max-w-6xl px-6 pb-32">
        <p className="mono-label pt-20">CONTRIBUTOR CONSOLE</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Sign in required</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8c9197]">
          Sign in with GitHub or Discord (top right) to open your console — manage
          worker keys, linked machines, and your contribution stats.
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
      {/* header row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-16">
        <div>
          <p className="mono-label">CONTRIBUTOR CONSOLE</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Welcome back{me.username ? ', ' : ''}
            {me.username ? <span className="text-[#8c9197]">{me.username}</span> : null}
          </h1>
        </div>
        <a href="/contribute" className="btn btn-primary">
          Add machine →
        </a>
      </div>

      {/* stats */}
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Your GPU hours" value={totalHours.toFixed(2)} sub={`${workers.length} machine${workers.length === 1 ? '' : 's'} linked`} />
        <StatCard label="Workers online" value={`${online}/${workers.length}`} sub="last 5 min" />
        <StatCard label="Network GPU hours" value={Math.round(stats.gpu_hours).toLocaleString()} sub="all contributors" />
        <StatCard label="Network contributors" value={stats.contributors.toLocaleString()} sub={`${stats.workers_online} online now`} />
      </div>

      {/* two-column body */}
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

        {/* right rail */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-[#161a1e] bg-[#07090b] p-5">
            <h3 className="mb-4 text-sm font-medium text-[#f5f5f2]">Network status</h3>
            <dl className="space-y-3 font-mono text-xs">
              <div className="flex justify-between"><dt className="text-[#555b61]">ACTIVE RUNS</dt><dd className="tabular text-[#f5f5f2]">{stats.active_runs}</dd></div>
              <div className="flex justify-between"><dt className="text-[#555b61]">CONTRIBUTORS</dt><dd className="tabular text-[#f5f5f2]">{stats.contributors.toLocaleString()}</dd></div>
              <div className="flex justify-between"><dt className="text-[#555b61]">ONLINE NOW</dt><dd className="tabular text-emerald-500">{stats.workers_online}</dd></div>
              <div className="flex justify-between"><dt className="text-[#555b61]">TOTAL HOURS</dt><dd className="tabular text-[#f5f5f2]">{Math.round(stats.gpu_hours).toLocaleString()}</dd></div>
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
