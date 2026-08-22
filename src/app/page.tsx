import Link from 'next/link';
import { LiveStats, LiveRuns } from '@/components/live';

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* ambient glows */}
      <div className="glow-orb left-1/4 top-[-120px] h-[380px] w-[520px] bg-[#2a344a]/50" />
      <div className="glow-orb right-[-100px] top-[220px] h-[300px] w-[300px] bg-[#37455c]/30" />
      <div className="dot-grid absolute inset-x-0 top-0 h-[560px]" />

      <section className="container relative mx-auto px-4 pb-24 pt-28 text-center md:pt-36">
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs tracking-wide text-[#9ca5b2] backdrop-blur-xl transition-colors duration-300 hover:border-white/20">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Community testing program — open to everyone
        </div>

        <h1 className="gradient-text mx-auto max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
          Intelligence, built together.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#8b93a1] md:text-lg">
          A community-driven research lab where people contribute compute, data,
          and evaluation toward building open AI models — openly, verifiably, together.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contribute"
            className="btn-primary rounded-full bg-white px-7 py-3 text-sm font-medium text-black"
          >
            Start contributing
          </Link>
          <Link
            href="/research"
            className="rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-[#c9cdd6] transition-all duration-300 hover:border-white/30 hover:text-white"
          >
            Explore research
          </Link>
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <LiveStats />
        </div>
      </section>

      <section className="container relative mx-auto px-4 pb-28">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-medium tracking-tight text-white">Featured research</h2>
          <Link href="/research" className="text-sm text-[#8b93a1] transition-colors hover:text-white">
            View all →
          </Link>
        </div>
        <LiveRuns />
      </section>
    </main>
  );
}
