import { LiveModels, Leaderboard } from '@/components/live';

export default function ModelsPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="glow-orb left-1/3 top-[-90px] h-[300px] w-[440px] bg-[#2a344a]/40" />
      <section className="container relative mx-auto px-4 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-[#6881a3]">Models</p>
        <h1 className="gradient-text mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Releases
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#8b93a1]">
          Every release is built in the open — weights and datasets published on Hugging Face,
          contributors named on the model card.
        </p>
        <div className="mt-12">
          <LiveModels />
        </div>

        <h2 className="mt-20 text-2xl font-medium tracking-tight text-white">Leaderboard</h2>
        <p className="mb-8 mt-2 text-sm text-[#8b93a1]">Top contributors by verified GPU hours.</p>
        <Leaderboard />
      </section>
    </main>
  );
}
