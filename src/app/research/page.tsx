import Link from 'next/link';
import { PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Research' };

const statusClass = (status: string) =>
  status === 'PUBLISHED'
    ? 'text-[#5b8fa8]'
    : status === 'ACTIVE'
      ? 'text-emerald-500'
      : 'text-[#555b61]';

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <p className="mono-label pt-20">THE AGENDA</p>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">RESEARCH</h1>
      <p className="mt-8 max-w-xl text-sm leading-relaxed text-[#8c9197]">
        Four programs, one question each. Hybrid model design is the through-line: where attention is
        still worth its cost, what a model does with position when it has less of it, and how to tell
        a real effect from a lucky run.
      </p>

      <div className="mt-16">
        {PROGRAMS.map((p) => (
          <article key={p.slug} id={p.slug} className="record border-t hairline py-14 last:border-b">
            <div className="grid gap-10 md:grid-cols-[3rem_1fr]">
              <span className="font-mono text-xs text-[#3d434b]">{p.id}</span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <h2 className="text-2xl font-medium tracking-tight text-[#f5f5f2]">{p.title}</h2>
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${statusClass(p.status)}`}>
                    {p.status}
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#c9cdd2]">{p.lead}</p>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#8c9197]">{p.summary}</p>

                <div className="mt-8 grid gap-8 md:grid-cols-[8rem_1fr]">
                  <p className="mono-label">APPROACH</p>
                  <ol className="space-y-3 text-sm leading-relaxed text-[#8c9197]">
                    {p.approach.map((a, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="shrink-0 font-mono text-[10px] text-[#3d434b]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {p.outputs && p.outputs.length > 0 && (
                  <div className="mt-8 grid gap-8 md:grid-cols-[8rem_1fr]">
                    <p className="mono-label">OUTPUT</p>
                    <ul className="space-y-2.5">
                      {p.outputs.map((o) => (
                        <li key={o.href}>
                          {o.external ? (
                            <a
                              href={o.href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-[#7aa7c0] underline-offset-4 hover:underline"
                            >
                              {o.label} ↗
                            </a>
                          ) : (
                            <Link
                              href={o.href}
                              className="text-sm text-[#7aa7c0] underline-offset-4 hover:underline"
                            >
                              {o.label} →
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-24 grid gap-12 border-t hairline pt-14 md:grid-cols-2">
        <div>
          <p className="mono-label mb-6">HOW WE WORK</p>
          <ol className="space-y-5 text-sm leading-relaxed text-[#8c9197]">
            <li>
              <span className="mr-4 font-mono text-[10px] text-[#3d434b]">01</span>
              One variable per experiment. If two things change, the result is a joint effect and is
              labelled as one.
            </li>
            <li>
              <span className="mr-4 font-mono text-[10px] text-[#3d434b]">02</span>
              The practical margin is written down before the run; the analysis method is named as
              pre-specified or post hoc.
            </li>
            <li>
              <span className="mr-4 font-mono text-[10px] text-[#3d434b]">03</span>
              Raw records, per-item indicators and a verification manifest ship with every result.
            </li>
            <li>
              <span className="mr-4 font-mono text-[10px] text-[#3d434b]">04</span>
              Corrections get a dated log. Verdicts that change are recorded as changed.
            </li>
          </ol>
        </div>
        <div className="flex flex-col justify-end">
          <p className="max-w-sm text-sm leading-relaxed text-[#555b61]">
            Work in progress is listed as <span className="text-[#8c9197]">ACTIVE</span> or{' '}
            <span className="text-[#8c9197]">PLANNED</span> and carries no results until there are
            records to show.
          </p>
          <Link href="/publications" className="btn btn-ghost mt-8 self-start">
            Publications →
          </Link>
        </div>
      </section>
    </main>
  );
}
