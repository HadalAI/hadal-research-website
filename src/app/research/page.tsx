import Link from 'next/link';
import { fetchRuns, fetchStats } from '@/lib/data';

export default async function ResearchPage() {
  const [runs, stats] = await Promise.all([fetchRuns(), fetchStats()]);
  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <p className="mono-label pt-20">LAB ARCHIVE</p>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">RESEARCH</h1>
      <div className="mt-10 rounded-xl border border-sky-400/25 bg-[#062033]/60 px-5 py-4">
        <p className="font-mono text-xs leading-relaxed text-[#c7d6e4]">
          <b className="text-sky-300">First training run launches September 1.</b> Run
          announcements appear here — connect your GPU now to join from day one.{' '}
          <Link href="/contribute" className="text-[#7dd3fc] underline-offset-2 hover:underline">
            How to join →
          </Link>
        </p>
      </div>
      <div className="mt-20">
        {runs.length === 0 ? (
          <p className="text-sm text-[#555b61]">Archive empty. First runs are being prepared.</p>
        ) : (
          runs.map((run) => (
            <article key={run.slug} className="record border-t hairline py-12 last:border-b">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <span className="font-mono text-2xl tracking-tight text-[#f5f5f2]">
                  {run.slug.toUpperCase()}
                </span>
                <span
                  className={`font-mono text-xs uppercase tracking-widest ${
                    run.status === 'ACTIVE'
                      ? 'text-emerald-500'
                      : run.status === 'PLANNED'
                        ? 'text-[#8c9197]'
                        : 'text-[#555b61]'
                  }`}
                >
                  {run.status}
                </span>
              </div>
              <h2 className="mt-4 max-w-2xl text-xl font-medium text-[#c9cdd2] md:text-2xl">{run.name}</h2>
              <div className="mt-6 grid grid-cols-3 gap-6 font-mono text-xs text-[#555b61] md:max-w-xl">
                <span>STATUS / {run.status}</span>
              </div>
            </article>
          ))
        )}
        <Link href="/contribute" className="btn btn-ghost mt-16 inline-flex">
          Join a research run →
        </Link>
      </div>
    </main>
  );
}