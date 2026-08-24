import Link from 'next/link';
import DatasetContribute from '@/components/dataset-contribute';

const ways = [
  {
    n: '01',
    title: 'CONTRIBUTE COMPUTE',
    desc: 'Run the Hadal Worker and contribute authorized GPU resources. Sandboxed jobs, your files untouched.',
    cmd: 'pip install hadal-worker && hadal-worker',
    cta: 'Run worker →',
  },
  {
    n: '02',
    title: 'CONTRIBUTE DATA',
    desc: 'Submit datasets for the shared shelf — annotations, preference rankings, domain knowledge. Reviewed before approval, then used by training runs.',
    datasetForm: true,
  },
  {
    n: '03',
    title: 'EVALUATE MODELS',
    desc: 'Independent evaluations from many machines are how results get verified. Eval shards are distributed to workers automatically with every run.',
    cta: 'See runs →',
  },
  {
    n: '04',
    title: 'CONTRIBUTE RESEARCH',
    desc: 'Submit experiments, ideas, methods, and discoveries to active runs — or open an issue in any HadalAI repo.',
    cta: 'GitHub ↗',
    href: 'https://github.com/HadalAI',
  },
];

export default function ContributePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <p className="mono-label pt-20">HADAL RESEARCH</p>
      <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
        CONTRIBUTE TO THE DEPTH.
      </h1>
      <p className="mt-8 max-w-lg text-sm leading-relaxed text-[#8c9197]">
        Hadal Research is built by people contributing what they can.
        <br />
        Choose how you want to participate.
      </p>

      <div className="mt-24 space-y-px bg-[#161a1e]">
        {ways.map((w) => (
          <section key={w.n} className="record bg-[#030405] px-6 py-14 md:px-12">
            <div className={`grid gap-8 ${w.datasetForm ? '' : 'md:grid-cols-[4rem_1fr_auto] md:items-center'}`}>
              {!w.datasetForm && <span className="font-mono text-sm text-[#555b61]">{w.n}</span>}
              {w.datasetForm ? (
                <>
                  <span className="font-mono text-sm text-[#555b61]">{w.n}</span>
                  <div>
                    <h2 className="font-mono text-xl tracking-widest text-[#f5f5f2]">{w.title}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8c9197]">{w.desc}</p>
                    <DatasetContribute />
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="font-mono text-xl tracking-widest text-[#f5f5f2]">{w.title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8c9197]">{w.desc}</p>
                  {w.cmd && (
                    <div className="mt-6 inline-flex items-center gap-3 border border-[#161a1e] bg-[#07090b] px-5 py-3 font-mono text-sm text-emerald-500">
                      <span className="select-none text-[#555b61]">$</span>
                      {w.cmd}
                    </div>
                  )}
                </div>
              )}
              {!w.datasetForm && w.cta && (
                <Link
                  href={w.href ?? '/research'}
                  {...(w.href ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="btn btn-ghost whitespace-nowrap"
                >
                  {w.cta}
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-16 font-mono text-xs leading-relaxed text-[#555b61]">
        SAFETY / Jobs execute sandboxed. The worker never reads personal files.
        Only hardware you own. Resource limits are yours to set.
      </p>
    </main>
  );
}
