import type { WorkerRow } from '@/lib/data';

/** Top contributors rail card — ranked list, avatar initials instead of images. */
export default function TopContributors({ rows }: { rows: WorkerRow[] }) {
  const top = [...rows].sort((a, b) => b.gpu_hours - a.gpu_hours).slice(0, 3);
  const colors = ['#5b8fa8', '#7d95ad', '#55616e'];
  return (
    <div className="rounded-xl border border-[#161a1e] bg-[#07090b] p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-[#f5f5f2]">Top Contributors</h3>
        <span className="text-[11px] text-[#555b61]">(This Month)</span>
      </div>
      {top.length === 0 ? (
        <p className="mt-4 text-xs text-[#555b61]">No entries yet.</p>
      ) : (
        <ol className="mt-5 space-y-4">
          {top.map((w, i) => (
            <li key={w.id} className="flex items-center gap-3">
              <span className="w-3 font-mono text-xs text-[#555b61]">{i + 1}</span>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] uppercase text-white"
                style={{ background: colors[i % colors.length] }}
              >
                {w.id.slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs text-[#f5f5f2]">{w.id}</span>
              <span className="shrink-0 font-mono text-[10px] tabular text-[#8c9197]">
                {w.gpu_hours.toFixed(0)} GPU hours
              </span>
            </li>
          ))}
        </ol>
      )}
      <a href="/models" className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#5b8fa8] hover:text-[#8cb6cc]">
        View leaderboard →
      </a>
    </div>
  );
}
