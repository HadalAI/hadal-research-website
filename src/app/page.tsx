import Link from 'next/link';
import { fetchStats, fetchRuns } from '@/lib/data';
import { Metric } from '@/components/metric';
import NetworkField from '@/components/network-field';
import ActivityFeed from '@/components/activity-feed';

export default async function HomePage() {
  const [stats, runs] = await Promise.all([fetchStats(), fetchRuns()]);
  const active = runs.find((r) => r.status === 'ACTIVE');

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="pointer-events-none absolute inset-0 opacity-[0.5]">
          <NetworkField height={640} />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-36 text-center md:pb-44 md:pt-48">
          <p className="mono-label mb-8">HADAL RESEARCH / HADAL.RUN</p>
          <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            INTELLIGENCE,
            <br />
            BUILT TOGETHER.
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#8c9197]">
            A community-driven AI research lab. Contribute compute, data,
            evaluation, research, and engineering to help build the next
            generation of AI.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contribute" className="btn btn-primary">
              Contribute →
            </Link>
            <Link href="/research" className="btn btn-ghost">
              Explore research
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE STATUS STRIP */}
      <section className="border-b hairline bg-[#07090b]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-6 py-10 font-mono text-xs md:grid-cols-4 md:divide-x md:divide-[#161a1e]">
          <div className="px-0 md:px-8 md:first:pl-0">
            <span className="dot-live mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
            <span className="text-[#8c9197]">STATUS / ACTIVE</span>
          </div>
          <Metric label="Workers online" value={stats.workers_online} />
          <Metric label="GPU hours" value={Math.round(stats.gpu_hours)} />
          <Metric label="Contributors" value={stats.contributors} />
        </div>
      </section>

      {/* CURRENT RESEARCH */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="mono-label mb-14">CURRENT RESEARCH</p>
          {active ? (
            <div className="grid gap-12 md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  <span className="font-mono text-4xl tracking-tight text-[#f5f5f2] md:text-5xl">
                    {active.slug.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-500">
                    <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {active.status}
                  </span>
                </div>
                <h2 className="mt-5 max-w-xl text-2xl font-medium text-[#c9cdd2] md:text-3xl">
                  {active.name}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#555b61]">
                  {active.description || 'Community evaluation and improvement of small open models.'}
                </p>
                <Link
                  href="/research"
                  className="btn btn-ghost mt-10"
                >
                  View research run →
                </Link>
              </div>
              <div className="flex flex-col justify-between gap-10 border-l-0 md:border-l md:pl-16 hairline">
                <Metric label="GPU hours" value={Math.round(active.gpu_hours ?? stats.gpu_hours)} />
                <Metric label="Contributors" value={active.contributors_count ?? stats.contributors} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#555b61]">No active run right now — first community run is being prepared.</p>
          )}
        </div>
      </section>

      {/* NETWORK */}
      <section className="relative overflow-hidden border-b hairline bg-[#04050700]">
        <NetworkField height={480} />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="mono-label mb-10">GLOBAL NETWORK</p>
            <div className="grid grid-cols-3 gap-8">
              <Metric label="Contributors" value={stats.contributors} />
              <Metric label="Workers online" value={stats.workers_online} />
              <Metric label="GPU hours" value={Math.round(stats.gpu_hours)} />
            </div>
          </div>
        </div>
      </section>

      {/* CONTRIBUTE */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="mono-label mb-14">HOW YOU CAN CONTRIBUTE</p>
          <div className="grid grid-cols-1 gap-px bg-[#161a1e] md:grid-cols-4">
            {[
              ['01', 'COMPUTE', 'Share authorized GPU compute with active research runs.', '/contribute'],
              ['02', 'DATA', 'Contribute datasets, annotations, and knowledge.', '/contribute'],
              ['03', 'EVALUATION', 'Help evaluate models and generate preference data.', '/contribute'],
              ['04', 'RESEARCH', 'Contribute experiments, ideas, methods, discoveries.', '/contribute'],
            ].map(([n, title, desc, href]) => (
              <Link
                key={n}
                href={href}
                className="group bg-[#030405] p-8 transition-colors duration-300 hover:bg-[#0b0e11]"
              >
                <span className="font-mono text-sm text-[#555b61]">{n}</span>
                <h3 className="mt-16 font-mono text-lg tracking-widest text-[#f5f5f2]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8c9197]">{desc}</p>
                <span className="mt-6 inline-block font-mono text-xs text-[#555b61] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#5b8fa8]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITY + FOOTER STRIP */}
      <section>
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2">
          <ActivityFeed />
          <div className="flex flex-col justify-end">
            <p className="mono-label mb-5">OPEN SOURCE</p>
            <p className="max-w-md text-sm leading-relaxed text-[#8c9197]">
              Everything — the API, the worker, this site — is public and
              Apache-2.0 licensed. Audit it, fork it, run your own node.
            </p>
            <div className="mt-8 flex gap-4 font-mono text-xs">
              <a href="https://github.com/kyssta-exe/hadal-api" target="_blank" rel="noreferrer" className="text-[#5b8fa8] hover:text-[#8c9197]">API /</a>
              <a href="https://github.com/kyssta-exe/hadal-worker" target="_blank" rel="noreferrer" className="text-[#5b8fa8] hover:text-[#8c9197]">WORKER /</a>
              <a href="https://github.com/kyssta-exe/hadal-research-website" target="_blank" rel="noreferrer" className="text-[#5b8fa8] hover:text-[#8c9197]">WEBSITE</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
