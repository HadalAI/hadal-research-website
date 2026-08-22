import type { RunWithMeta } from '@/lib/data';

const ICONS = {
  users:
    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
};

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555b61]">
        <path d={icon} />
      </svg>
      <span className="tabular text-sm font-medium text-[#f5f5f2]">{value}</span>
      <span className="text-xs text-[#555b61]">{label}</span>
    </div>
  );
}

/** Research run card: ID chip + live dot, title, blurb, progress bar, metrics, deadline. */
export default function RunCard({ run }: { run: RunWithMeta }) {
  return (
    <div className="group flex h-full flex-col rounded-xl border border-[#161a1e] bg-[#07090b] p-6 transition-colors duration-300 hover:border-[#2a3037]">
      <div className="flex items-center justify-between">
        <span className="rounded-md border border-[#161a1e] bg-[#030405] px-2.5 py-1 font-mono text-[10px] tracking-widest text-[#8c9197]">
          {run.slug.toUpperCase()}
        </span>
        <span className="dot-live h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </div>
      <h3 className="mt-5 text-lg font-medium leading-snug text-[#f5f5f2]">{run.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#8c9197]">{run.description}</p>

      <div className="mt-6 flex items-center gap-4">
        <span className="w-9 shrink-0 font-mono text-xs tabular text-[#8c9197]">{run.progress}%</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#161a1e]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3d5a73] to-[#5b8fa8] transition-all duration-1000 ease-out"
            style={{ width: `${run.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#161a1e]/70 pt-5">
        <Stat icon={ICONS.users} value={run.contributors_count.toLocaleString()} label="Contributors" />
        <Stat icon={ICONS.clock} value={Math.round(run.gpu_hours).toLocaleString()} label="GPU hours" />
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-[#555b61]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        Ends in {run.ends_in_days} days
      </div>
    </div>
  );
}
