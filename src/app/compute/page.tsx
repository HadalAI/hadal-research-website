import Doodle from '@/components/doodles';
import { Paper, SectionTitle, HandRule, DoodleRow, Circled } from '@/components/sketch';

export const metadata = { title: 'Compute' };

const STEPS: [string, string][] = [
  ['A run is defined', 'as a job graph: shards, checkpoints, and the acceptance test every result must pass.'],
  ['The scheduler assigns', 'each shard to a machine reporting the right hardware, inside a sandbox that only sees job data.'],
  ['Results come back', 'with hashes. Verification re-checks them against the acceptance test before they are counted.'],
  ['Everything is archived', '— checkpoints, config and records — so a result can be rebuilt rather than re-argued.'],
];

export default function ComputePage() {
  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label flex items-center gap-2"><Doodle name="flask" className="h-6 w-6 text-marker" /> section five</p>
            <h1 className="mt-3 font-marker text-[clamp(44px,7vw,72px)] leading-none">Compute</h1>
            <p className="mt-5 max-w-[56ch] text-[20px] leading-snug">
              Experiments run on a small distributed substrate: a scheduler, sandboxed execution, and verification before a number is allowed to enter a result.
            </p>
          </div>
          <Paper variant={1} tilt="l">
            <p className="label">the hardware</p>
            <p className="mt-1 text-[19px]">gpu cluster <Circled className="font-marker text-[24px] text-marker">none</Circled></p>
            <p className="note text-pencil">model ceiling · ~1.5B params, float32</p>
          </Paper>
        </div>
        <DoodleRow count={12} className="justify-start !pb-0" />
      </header>

      <HandRule />

      <section>
        <SectionTitle icon="spiral">How a run moves</SectionTitle>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {STEPS.map(([lead, rest], i) => (
            <Paper key={lead} variant={(i % 4) as 0 | 1 | 2 | 3} tilt={i % 2 === 0 ? 'l' : 'r'}>
              <div className="flex items-start gap-3">
                <span className="font-marker text-[30px] text-marker">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[18px] leading-snug"><span className="highlight">{lead}</span> {rest}</p>
              </div>
              <Doodle name="arrowDown" className="ml-auto h-6 w-6 text-marker" />
            </Paper>
          ))}
        </div>
      </section>

      <HandRule />

      <section className="grid gap-8 pb-12 md:grid-cols-2">
        <div>
          <SectionTitle icon="book">Software</SectionTitle>
          <p className="mt-4 text-[19px] leading-snug">
            The scheduler, worker daemon and API are open source under Apache-2.0. The worker executes only job-assigned data; it does not read host files, and it reports hardware and job results, nothing else.
          </p>
          <div className="mt-4 space-y-3">
            {[
              ['hadal-api', 'https://github.com/HadalAI/hadal-api', 'scheduler · runs · verification'],
              ['hadal-worker', 'https://github.com/HadalAI/hadal-worker', 'sandboxed execution'],
            ].map(([name, href, note]) => (
              <p key={name} className="flex flex-wrap items-center gap-2">
                <Doodle name="arrow" className="h-5 w-5 text-marker" />
                <a href={href} target="_blank" rel="noreferrer" className="link text-[18px]">{name}</a>
                <span className="note text-pencil">{note}</span>
              </p>
            ))}
          </div>
        </div>
        <Paper variant={3} tilt="r">
          <p className="label flex items-center gap-2"><Doodle name="eye" className="h-5 w-5 text-marker" /> limits, stated not worked around</p>
          <p className="mt-3 text-[18px] leading-snug">
            No GPU cluster and no rented accelerator allocation. Experiments are sized to run on constrained hardware, which caps model scale at roughly 1.5B parameters in float32 — and makes every result a small-model result. That limit is stated in each paper.
          </p>
        </Paper>
      </section>
    </main>
  );
}
