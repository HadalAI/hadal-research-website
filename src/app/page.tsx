import Link from 'next/link';
import { fetchRuns, fetchStats, fetchWorkers } from '@/lib/data';
import GlobeField from '@/components/globe-field';
import RunCard from '@/components/run-card';
import ActivityFeed from '@/components/activity-feed';
import Rail from '@/components/rail';

const WAY_ICONS: Record<string, string> = {
  Compute: 'M2 3h20v14H2zM8 21h8M12 17v4',
  Data: 'M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3',
  Evaluation: 'M18 20V10M12 20V4M6 20v-6',
  Research: 'M10 2v7L4.5 19a1 1 0 0 0 .9 1.5h13.2a1 1 0 0 0 .9-1.5L14 9V2M8.5 2h7M7 15h10',
  Engineering: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
};

const CONTRIBUTE_WAYS = [
  ['Compute', 'Share your GPU power'],
  ['Data', 'Contribute datasets'],
  ['Evaluation', 'Help evaluate model outputs'],
  ['Research', 'Run experiments & share ideas'],
  ['Engineering', 'Build tools & improve infrastructure'],
] as const;

const Icon = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555b61]">
    <path d={d} />
  </svg>
);

const ICONS = {
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  monitor: 'M2 3h20v14H2zM8 21h8M12 17v4',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  flask: 'M10 2v7L4.5 19a1 1 0 0 0 .9 1.5h13.2a1 1 0 0 0 .9-1.5L14 9V2M8.5 2h7M7 15h10',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
};

function StatCell({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <Icon d={icon} />
      <span className="font-mono text-xl tabular text-[#f5f5f2]">{value.toLocaleString()}</span>
      <span className="text-xs text-[#555b61]">{label}</span>
    </div>
  );
}

export default async function HomePage() {
  const [stats, runs, workers] = await Promise.all([
    fetchStats(),
    fetchRuns(),
    fetchWorkers(),
  ]);
  const shown = runs.slice(0, 3);

  return (
    <main>
      {/* HERO: split — copy left, globe + online card right */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 pb-16 pt-16 md:pt-20 lg:grid-cols-[1fr_560px]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md border border-sky-400/30 bg-[#062033] px-3 py-1.5 font-mono text-[11px] tracking-widest text-sky-300">
              <span className="dot-live h-1.5 w-1.5 rounded-full bg-sky-400" />
              FIRST TRAINING RUN — SEPTEMBER
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
          </div>

          <div className="relative mx-auto -mb-8 mt-4 w-full max-w-[340px] lg:mb-0 lg:mt-0 lg:w-auto lg:max-w-none">
            <GlobeField size={560} />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b hairline bg-[#07090b]/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[#161a1e] px-6 py-2 md:grid-cols-3 xl:grid-cols-6">
          <StatCell icon={ICONS.users} value={stats.contributors} label="Contributors" />
          <StatCell icon={ICONS.monitor} value={stats.workers_online} label="Workers online" />
          <StatCell icon={ICONS.clock} value={Math.round(stats.gpu_hours)} label="GPU hours today" />
          <StatCell icon={ICONS.flask} value={stats.active_runs} label="Active research runs" />
          <StatCell icon={ICONS.layers} value={0} label="Datasets" />
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
              {CONTRIBUTE_WAYS.map(([title, desc]) => (
                <li key={title}>
                  <a
                    href="/contribute"
                    className="-mx-3 flex items-center gap-3.5 rounded-lg px-3 py-3 transition-colors duration-200 hover:bg-[#0b0e11]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#161a1e] bg-[#030405]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c9197" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={WAY_ICONS[title]} />
                      </svg>
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