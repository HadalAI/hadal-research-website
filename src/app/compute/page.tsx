import NetworkField from '@/components/network-field';

export const metadata = { title: 'Compute' };

const STEPS: [string, string][] = [
  ['01', 'A run is defined as a job graph: shards, checkpoints, and the acceptance test each result must pass.'],
  ['02', 'The scheduler hands each shard to a machine that reports the right hardware, inside a sandbox that only sees job data.'],
  ['03', 'Results come back with hashes. Verification re-checks them against the acceptance test before they are counted.'],
  ['04', 'Every checkpoint, config and record is written to the run archive, so a result can be rebuilt rather than re-argued.'],
];

export default function ComputePage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pt-20">
        <p className="mono-label">INFRASTRUCTURE</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">COMPUTE</h1>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-[#8c9197]">
          The lab runs its own experiments on a small distributed substrate: a scheduler, sandboxed
          job execution, and verification before a number is allowed to enter a result. It is built
          to be inspectable, because a result you cannot rebuild is a claim, not a finding.
        </p>
      </section>

      <section className="relative mt-16 overflow-hidden border-y hairline">
        <NetworkField height={460} />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="mono-label mb-6">SUBSTRATE</p>
            <p className="max-w-lg font-mono text-sm leading-relaxed text-[#c9cdd2]">
              Heterogeneous machines, one job graph. Small models on constrained hardware, so that
              scale is never the explanation.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-14 md:grid-cols-[8rem_1fr]">
          <p className="mono-label">RUN LIFECYCLE</p>
          <ol className="space-y-8">
            {STEPS.map(([n, text]) => (
              <li key={n} className="flex gap-6 border-b hairline pb-8 last:border-0 last:pb-0">
                <span className="shrink-0 font-mono text-[10px] text-[#3d434b]">{n}</span>
                <p className="max-w-2xl text-sm leading-relaxed text-[#8c9197]">{text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-10 border-t hairline pt-12 md:grid-cols-[8rem_1fr]">
          <p className="mono-label">SOFTWARE</p>
          <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-[#8c9197]">
            <p>
              The scheduler, the worker daemon and the API are open source under Apache-2.0. The
              worker executes only job-assigned data; it does not read host files, and it reports
              hardware and job results, nothing else.
            </p>
            <ul className="space-y-2.5 pt-2 font-mono text-xs">
              <li>
                <a
                  href="https://github.com/HadalAI/hadal-api"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#7aa7c0] underline-offset-4 hover:underline"
                >
                  hadal-api ↗
                </a>
                <span className="ml-3 text-[#555b61]">scheduler, runs, verification</span>
              </li>
              <li>
                <a
                  href="https://github.com/HadalAI/hadal-worker"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#7aa7c0] underline-offset-4 hover:underline"
                >
                  hadal-worker ↗
                </a>
                <span className="ml-3 text-[#555b61]">sandboxed execution</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t hairline pt-12">
          <p className="mono-label mb-5">LIMITS</p>
          <p className="max-w-2xl text-sm leading-relaxed text-[#8c9197]">
            No GPU cluster, no rented A100 allocation. Experiments are sized to run on constrained
            hardware, which caps model scale at roughly 1.5B parameters in float32 — and makes every
            result a small-model result. That limit is stated in each paper rather than worked
            around.
          </p>
        </div>
      </section>
    </main>
  );
}
