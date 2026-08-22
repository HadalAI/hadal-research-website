import { LiveRuns } from '@/components/live';

export default function ResearchPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="glow-orb right-1/4 top-[-80px] h-[280px] w-[420px] bg-[#2a344a]/40" />
      <section className="container relative mx-auto px-4 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-[#6881a3]">Research</p>
        <h1 className="gradient-text mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Active runs
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#8b93a1]">
          Every run is executed by community workers and verified before it counts.
        </p>
        <div className="mt-12">
          <LiveRuns />
        </div>
      </section>
    </main>
  );
}
