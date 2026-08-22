import Link from 'next/link';

const ways = [
  {
    icon: '💻',
    title: 'Compute',
    desc: 'Run the Hadal worker on your machine. It picks up verified research jobs in the background and banks GPU hours for every one it completes.',
  },
  {
    icon: '📊',
    title: 'Data',
    desc: 'Contribute datasets and annotations that improve how community models learn.',
  },
  {
    icon: '🧪',
    title: 'Evaluation',
    desc: 'Score model outputs. Independent evaluations from many machines are how results get verified.',
  },
];

export default function ContributePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="glow-orb left-1/2 top-[-100px] h-[320px] w-[480px] -translate-x-1/2 bg-[#2a344a]/45" />
      <section className="container relative mx-auto px-4 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-[#6881a3]">Contribute</p>
        <h1 className="gradient-text mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Put your hardware to work
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#8b93a1]">
          Three ways in — all open, all credited on the public leaderboard.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {ways.map((w) => (
            <div key={w.title} className="glass rounded-2xl p-7">
              <div className="text-2xl">{w.icon}</div>
              <h3 className="mt-4 font-medium text-white">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8b93a1]">{w.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass mt-12 rounded-2xl p-8 md:p-10">
          <h2 className="text-xl font-medium text-white">Run the worker</h2>
          <p className="mt-2 text-sm text-[#8b93a1]">
            One command. Your GPU is detected automatically; nothing on your files is ever touched.
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-5 py-4 font-mono text-sm text-emerald-300">
            <span className="select-none text-[#8b93a1]">$</span>
            npx @hadal/worker
          </div>
          <p className="mt-3 text-xs text-[#8b93a1]">
            Requires Node 18+. NVIDIA GPUs via nvidia-smi; CPU-only machines are welcome on eval jobs.
          </p>
        </div>
      </section>
    </main>
  );
}
