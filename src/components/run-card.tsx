import type { ResearchRun } from '@/lib/data';

/** Research run card — only fields the API actually serves. */
export default function RunCard({ run }: { run: ResearchRun }) {
  const active = run.status === 'ACTIVE';
  return (
    <div className="group flex h-full flex-col rounded-xl border border-[#161a1e] bg-[#07090b] p-6 transition-colors duration-300 hover:border-[#2a3037]">
      <div className="flex items-center justify-between">
        <span className="rounded-md border border-[#161a1e] bg-[#030405] px-2.5 py-1 font-mono text-[10px] tracking-widest text-[#8c9197]">
          {run.slug.toUpperCase()}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest">
          <span className={`h-1.5 w-1.5 rounded-full ${active ? 'dot-live bg-emerald-500' : 'bg-[#555b61]'}`} />
          <span className={active ? 'text-emerald-500' : 'text-[#8c9197]'}>{run.status}</span>
        </span>
      </div>
      <h3 className="mt-5 text-lg font-medium leading-snug text-[#f5f5f2]">{run.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#8c9197]">{run.description}</p>
    </div>
  );
}
