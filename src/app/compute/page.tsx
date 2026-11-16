import { Frame, Stamp, Rule as SketchRule } from '@/components/sketch';
import { Doodle, CurveArrow } from '@/components/doodles';

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

const SOFTWARE: [string, string, string][] = [
  ['hadal-api', 'https://github.com/HadalAI/hadal-api', 'scheduler · runs · verification'],
  ['hadal-worker', 'https://github.com/HadalAI/hadal-worker', 'sandboxed execution'],
];

export default function ComputePage() {
  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="grid gap-8 pb-8 pt-10 md:grid-cols-[1fr_auto] md:items-end md:pt-14">
        <div>
          <p className="label flex items-center gap-2 text-pencil">
            <span className="ring text-[15px] text-marker">05</span>
            section five
          </p>
          <h1 className="mt-4 font-marker text-[clamp(42px,7vw,70px)] leading-[0.95]">Compute</h1>
          <p className="mt-5 max-w-[56ch] text-[20px] leading-snug text-pencil">
            Experiments run on a small distributed substrate: a scheduler, sandboxed execution, and
            verification before a number is allowed to enter a result.
          </p>
        </div>

        <div className="sticky w-fit rotate-[-1deg] px-5 pb-4 pt-3">
          <p className="label text-[14px] text-ink/70">the hardware</p>
          <p className="mt-1 text-[19px]">
            <span className="text-pencil">gpu cluster</span>{' '}
            <span className="font-marker text-[24px] leading-none">none</span>
          </p>
          <p className="text-[16px] text-pencil">model ceiling · ~1.5B params, float32</p>
        </div>
      </header>

      <SketchRule className="text-ink" />

      <section className="py-10">
        <p className="label flex items-center gap-2 text-pencil">
          <Doodle name="spiral" className="h-4 w-4 text-marker" strokeWidth={3} />
          how a run moves
        </p>
        <ol className="mt-5 space-y-4">
          {STEPS.map(([lead, rest], i) => (
            <li key={lead} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <span className="ring shrink-0 text-marker">{String(i + 1).padStart(2, '0')}</span>
                {i < STEPS.length - 1 && (
                  <span className="mt-1 h-full">
                    <Doodle name="arrowDown" className="h-8 w-5 text-ink/35" strokeWidth={2.6} />
                  </span>
                )}
              </div>
              <p className="max-w-[62ch] pb-2 text-[19px] leading-snug text-pencil">
                <span className="text-ink">{lead}</span> {rest}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-8 py-10 md:grid-cols-[1fr_1.2fr] md:gap-12">
        <div>
          <p className="label flex items-center gap-2 text-pencil">
            <Doodle name="book" className="h-4 w-4 text-marker" strokeWidth={3} />
            software
          </p>
          <p className="mt-3 max-w-[46ch] text-[19px] leading-snug text-pencil">
            The scheduler, worker daemon and API are open source under Apache-2.0. The worker
            executes only job-assigned data; it does not read host files, and it reports hardware
            and job results, nothing else.
          </p>
          <ul className="mt-4 space-y-2">
            {SOFTWARE.map(([name, href, note]) => (
              <li key={name} className="flex flex-wrap items-baseline gap-x-3">
                <a href={href} target="_blank" rel="noreferrer" className="link text-[18px]">
                  {name}
                </a>
                <span className="label text-[13px] text-pencil">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <Frame fill tilt="r" className="px-6 py-6">
          <div className="flex items-start gap-3">
            <Doodle name="flask" className="mt-1 h-7 w-7 shrink-0 text-marker" strokeWidth={2.6} />
            <div>
              <p className="label text-pencil">limits, stated not worked around</p>
              <p className="mt-2 text-[18px] leading-snug">
                No GPU cluster and no rented accelerator allocation. Experiments are sized to run on
                constrained hardware, which caps model scale at roughly 1.5B parameters in float32 —
                and makes every result a small-model result. That limit is stated in each paper.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <CurveArrow className="h-10 w-12 text-marker" flip />
            <Stamp>small on purpose</Stamp>
          </div>
        </Frame>
      </section>
    </main>
  );
}
