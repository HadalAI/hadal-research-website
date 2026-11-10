export const metadata = { title: 'Compute' };

const STEPS: [string, string][] = [
  [
    'A run is defined',
    'as a job graph: shards, checkpoints, and the acceptance test every result must pass.',
  ],
  [
    'The scheduler assigns',
    'each shard to a machine reporting the right hardware, inside a sandbox that only sees job data.',
  ],
  [
    'Results come back',
    'with hashes. Verification re-checks them against the acceptance test before they are counted.',
  ],
  [
    'Everything is archived',
    '— checkpoints, config and records — so a result can be rebuilt rather than re-argued.',
  ],
];

export default function ComputePage() {
  return (
    <main className="mx-auto max-w-page px-6 md:px-10">
      <header className="grid gap-10 border-b border-rule py-14 md:grid-cols-[1fr_260px] md:items-end">
        <div>
          <p className="mono-label">Section 05</p>
          <h1 className="mt-5 font-sans text-[clamp(40px,6vw,64px)] font-medium leading-[0.96] tracking-[-0.03em]">
            Compute
          </h1>
          <p className="mt-6 max-w-[52ch] font-serif text-[18px] leading-[1.55] text-muted">
            Experiments run on a small distributed substrate: a scheduler, sandboxed execution, and
            verification before a number is allowed to enter a result.
          </p>
        </div>
        <dl className="border-t border-rule pt-4 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <div className="flex justify-between gap-4">
            <dt className="mono-label">GPU cluster</dt>
            <dd className="font-mono text-[11px]">None</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="mono-label">Model ceiling</dt>
            <dd className="tabular font-mono text-[11px]">~1.5B</dd>
          </div>
        </dl>
      </header>

      <section className="grid gap-8 border-b border-rule py-12 md:grid-cols-[5rem_1fr]">
        <p className="mono-label">Run</p>
        <ol className="max-w-[64ch] space-y-6">
          {STEPS.map(([lead, rest], i) => (
            <li key={lead} className="grid grid-cols-[2rem_1fr] gap-4 border-t border-rule pt-4 first:border-0 first:pt-0">
              <span className="mono-label tabular">{String(i + 1).padStart(2, '0')}</span>
              <p className="font-serif text-[17px] leading-[1.6] text-muted">
                <span className="text-ink">{lead}</span> {rest}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-8 border-b border-rule py-12 md:grid-cols-[5rem_1fr]">
        <p className="mono-label">Software</p>
        <div className="max-w-[64ch] space-y-5 font-serif text-[17px] leading-[1.6] text-muted">
          <p>
            The scheduler, worker daemon and API are open source under Apache-2.0. The worker
            executes only job-assigned data; it does not read host files, and it reports hardware
            and job results, nothing else.
          </p>
          <ul className="space-y-2">
            <li className="flex flex-wrap items-baseline gap-x-4">
              <a
                href="https://github.com/HadalAI/hadal-api"
                target="_blank"
                rel="noreferrer"
                className="link font-serif text-[16px]"
              >
                hadal-api ↗
              </a>
              <span className="mono-label">scheduler · runs · verification</span>
            </li>
            <li className="flex flex-wrap items-baseline gap-x-4">
              <a
                href="https://github.com/HadalAI/hadal-worker"
                target="_blank"
                rel="noreferrer"
                className="link font-serif text-[16px]"
              >
                hadal-worker ↗
              </a>
              <span className="mono-label">sandboxed execution</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-8 py-12 md:grid-cols-[5rem_1fr]">
        <p className="mono-label">Limits</p>
        <p className="max-w-[64ch] font-serif text-[17px] leading-[1.6] text-muted">
          No GPU cluster and no rented accelerator allocation. Experiments are sized to run on
          constrained hardware, which caps model scale at roughly 1.5B parameters in float32 — and
          makes every result a small-model result. That limit is stated in each paper rather than
          worked around.
        </p>
      </section>
    </main>
  );
}
