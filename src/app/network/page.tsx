import Link from 'next/link';
import NetworkField from '@/components/network-field';

export const metadata = { title: 'Network' };

export default async function NetworkPage() {
  const { fetchStats } = await import('@/lib/data');
  const stats = await fetchStats();
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pt-20">
        <p className="mono-label">INFRASTRUCTURE</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">THE NETWORK</h1>
        <p className="mt-8 max-w-lg text-sm leading-relaxed text-[#8c9197]">
          Independent machines, one research effort. Workers receive sandboxed
          jobs, execute them locally, and results are verified before they count.
        </p>
        <div className="mt-8 max-w-lg rounded-xl border border-sky-400/25 bg-[#062033]/60 px-5 py-4">
          <p className="font-mono text-xs leading-relaxed text-[#c7d6e4]">
            <b className="text-sky-300">First training run: this September.</b> Every
            machine online that day takes part.{' '}
            <Link href="/contribute" className="text-[#7dd3fc] underline-offset-2 hover:underline">
              Connect yours →
            </Link>
          </p>
        </div>
      </section>

      <section className="relative mt-16 overflow-hidden border-y hairline">
        <NetworkField height={520} />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
            {[
              ['CONTRIBUTORS', stats.contributors],
              ['WORKERS ONLINE', stats.workers_online],
              ['GPU HOURS', Math.round(stats.gpu_hours)],
              ['ACTIVE RUNS', stats.active_runs],
            ].map(([label, v]) => (
              <div key={label as string}>
                <p className="mono-label mb-3">{label}</p>
                <p className="tabular font-mono text-2xl text-[#f5f5f2] md:text-3xl">
                  {(v as number).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mono-label mb-6">HOW IT WORKS</p>
            <ol className="space-y-6 text-sm leading-relaxed text-[#8c9197]">
              <li><span className="mr-3 font-mono text-xs text-[#555b61]">01</span>Worker registers and reports hardware.</li>
              <li><span className="mr-3 font-mono text-xs text-[#555b61]">02</span>Dispatcher assigns a sandboxed job matching your GPU.</li>
              <li><span className="mr-3 font-mono text-xs text-[#555b61]">03</span>Result uploads; independent verification checks it.</li>
              <li><span className="mr-3 font-mono text-xs text-[#555b61]">04</span>Verified GPU hours are credited to your name.</li>
            </ol>
          </div>
          <div className="flex flex-col justify-end">
            <Link href="/contribute" className="btn btn-primary self-start">
              Join the network →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
