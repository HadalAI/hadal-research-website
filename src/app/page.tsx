import Link from 'next/link';
import { fetchRunCards, fetchStats, fetchWorkers } from '@/lib/data';
import GlobeField from '@/components/globe-field';
import RunCard from '@/components/run-card';
import ActivityFeed from '@/components/activity-feed';
import Rail from '@/components/rail';

const CONTRIBUTE_WAYS = [
  ['🖥️', 'Compute', 'Share your GPU power'],
  ['🗄️', 'Data', 'Contribute datasets'],
  ['📊', 'Evaluation', 'Help evaluate model outputs'],
  ['🧪', 'Research', 'Run experiments & share ideas'],
  ['⚙️', 'Engineering', 'Build tools & improve infrastructure'],
] as const;

function StatCell({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className="text-lg text-[#8c9197]">{icon}</span>
      <span className="font-mono text-xl tabular text-[#f5f5f2]">{value.toLocaleString()}</span>
      <span className="text-xs text-[#555b61]">{label}</span>
    </div>
  );
}

export default async function HomePage() {
  const [stats, runs, workers] = await Promise.all([
    fetchStats(),
    fetchRunCards(),
    fetchWorkers(),
  ]);
  const shown = runs.slice(0, 3);

  return (
    <main>
      {/* HERO: split — copy left, globe + online card right */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 md:pt-20 lg:grid-cols-[1fr_420px]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md border border-[#161a1e] bg-[#07090b] px-3 py-1.5 font-mono text-[11px] tracking-widest text-[#8c9197]">
              <span className="dot-live h-1.5 w-1.5 rounded-full bg-emerald-500" />
              COMMUNITY-DRIVEN AI RESEARCH LAB
            </span>
            <h1 className="mt-7 text-5xl font-semibold leading-[1.04] tracking-tight md:text-[64px]">
              Intelligence,
              <br />
              <span className="bg-gradient-to-r from-white via-[#8fa8bf] to-[#41546b] bg-clip-text text-transparent">
                built together.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#8c9197]">
              Hadal Research is a global community building open AI through
              compute, data, research, and collaboration.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/contribute" className="btn btn-primary !rounded-lg">
                Contribute Now&nbsp;&nbsp;→
              </Link>
              <Link href="/research" className="btn btn-ghost !rounded-lg">
                Explore Research
              </Link>
            </div>
            <p className="mt-10 flex items-center gap-2 font-mono text-xs text-[#555b61]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#5b8fa8">
                <path d="M8 5v14l11-7z" />
              </svg>
              How it works
              <span className="ml-4">·</span>
              <span className="ml-2">○ Watch 2 min demo</span>
            </p>
          </div>

          <div className="relative hidden lg:block">
            <GlobeField size={480} />
            <div className="absolute bottom-6 right-0 w-56 rounded-xl border border-[#161a1e] bg-[#07090b]/90 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <span className="dot-live h-2 w-2 rounded-full bg-emerald-500" />
                <span className="tabular font-mono text-sm text-[#f5f5f2]">
                  {stats.workers_online} workers online
                </span>
              </div>
              <p className="mt-1.5 pl-[18px] text-xs text-[#555b61]">Across the open network</p>
              <div className="mt-4 flex h-10 items-end gap-1 pl-[18px]" aria-hidden="true">
                {[35, 55, 40, 70, 50, 80, 45, 65, 90, 60, 75, 85].map((h, i) => (
                  <span key={i} className="w-1 rounded-sm bg-[#31465c]" style={{ height: `${h}%` }} />
                ))}
              </div>
              <a href="/network" className="mt-4 inline-flex items-center justify-between pl-[18px] text-xs text-[#5b8fa8] hover:text-[#8cb6cc]">
                View the network <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b hairline bg-[#07090b]/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[#161a1e] px-6 py-2 md:grid-cols-3 xl:grid-cols-6">
          <StatCell icon="👥" value={stats.contributors} label="Contributors" />
          <StatCell icon="🖥️" value={stats.workers_online} label="Workers online" />
          <StatCell icon="⏱️" value={Math.round(stats.gpu_hours)} label="GPU hours today" />
          <StatCell icon="🧪" value={stats.active_runs} label="Active research runs" />
          <StatCell icon="🗂️" value={0} label="Datasets" />
          <StatCell icon="</>" value={0} label="Experiments" />
        </div>
      </section>

      {/* MAIN GRID: runs left, rail right */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-[#f5f5f2]">Active Research Runs</h2>
            <Link href="/research" className="inline-flex items-center gap-2 text-xs text-[#8c9197] transition-colors hover:text-[#f5f5f2]">
              View all runs →
            </Link>
          </div>
          {shown.length === 0 ? (
            <div className="rounded-xl border border-[#161a1e] bg-[#07090b] p-10 text-sm text-[#555b61]">
              No active runs yet — the first community runs are being prepared.
            </div>
          ) : (
            <div className={`grid gap-5 ${shown.length >= 3 ? 'md:grid-cols-3' : shown.length === 2 ? 'md:grid-cols-2' : ''}`}>
              {shown.map((run) => (
                <RunCard key={run.slug} run={run} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT RAIL */}
        <aside className="space-y-6">
          <Rail />
          <div className="rounded-xl border border-[#161a1e] bg-[#07090b] p-5">
            <h3 className="mb-2 text-sm font-medium text-[#f5f5f2]">Contribute Your Way</h3>
            <ul>
              {CONTRIBUTE_WAYS.map(([icon, title, desc]) => (
                <li key={title}>
                  <a
                    href="/contribute"
                    className="-mx-3 flex items-center gap-3.5 rounded-lg px-3 py-3 transition-colors duration-200 hover:bg-[#0b0e11]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#161a1e] bg-[#030405] text-sm">
                      {icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-[#f5f5f2]">{title}</span>
                      <span className="block truncate text-[11px] text-[#555b61]">{desc}</span>
                    </span>
                    <span className="text-[#3d434b]">›</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

    </main>
  );
}