import type { WorkerRow } from '@/lib/data';

export default function LeaderboardTable({ rows }: { rows: WorkerRow[] }) {
  return (
    <div>
      <p className="mono-label mb-10">CONTRIBUTOR LEADERBOARD / BY VERIFIED GPU HOURS</p>
      {rows.length === 0 ? (
        <p className="text-sm text-[#555b61]">
          No entries yet. The first workers will appear here as they complete verified work.
        </p>
      ) : (
        <div className="border-t hairline font-mono text-xs">
          {rows.map((w, i) => (
            <div
              key={w.id}
              className="record grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b hairline py-4"
            >
              <span className="text-[#555b61]">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[#f5f5f2]">
                worker_{w.id}
                <span className="ml-3 text-[#555b61]">{w.gpu}{w.vram ? ` / ${w.vram.toFixed(0)}GB` : ''}</span>
              </span>
              <span className="tabular text-[#8c9197]">{w.gpu_hours.toFixed(2)} H</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
