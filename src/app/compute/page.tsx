export const metadata = { title: 'Compute' };

const STEPS: [string, string][] = [
  ['A run is defined', 'as a job graph: shards, checkpoints, and the acceptance test every result must pass.'],
  ['The scheduler assigns', 'each shard to a machine reporting the right hardware, inside a sandbox that only sees job data.'],
  ['Results come back', 'with hashes. Verification re-checks them against the acceptance test before they are counted.'],
  ['Everything is archived', '— checkpoints, config and records — so a result can be rebuilt rather than re-argued.'],
];

export default function ComputePage() {
  return (
    <main className="shell pb-4">
      <header className="pt-14 pb-10">
        <h1 className="display page-title m-0">Compute</h1>
        <p className="lede mt-6 mb-0">
          Experiments run on a small distributed substrate: a scheduler, sandboxed execution, and
          verification before a number is allowed to enter a result.
        </p>
      </header>

      <div className="stack">
        <section>
          <h2 className="section-title">How a run moves</h2>
          <ol className="muted mb-0 pl-5">
            {STEPS.map(([lead, rest]) => (
              <li key={lead} className="mb-3"><span className="text-ink">{lead}</span> {rest}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="section-title">Software</h2>
          <p>
            The scheduler, worker daemon and API are open source under Apache-2.0. The worker executes only
            job-assigned data; it does not read host files, and it reports hardware and job results, nothing else.
          </p>
          <p className="meta mb-0 flex flex-wrap gap-x-5 gap-y-2">
            <a href="https://github.com/HadalAI/hadal-api" target="_blank" rel="noreferrer">hadal-api</a>
            <a href="https://github.com/HadalAI/hadal-worker" target="_blank" rel="noreferrer">hadal-worker</a>
          </p>
        </section>

        <section>
          <h2 className="section-title">Limits</h2>
          <p className="mb-0">
            No GPU cluster and no rented accelerator allocation. Experiments are sized to run on constrained
            hardware, which caps model scale at roughly 1.5B parameters in float32 — and makes every result a
            small-model result. That limit is stated in each paper rather than worked around.
          </p>
        </section>
      </div>
    </main>
  );
}
