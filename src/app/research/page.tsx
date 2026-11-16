import Link from 'next/link';
import { PROGRAMS } from '@/lib/lab';
import { Frame, Stamp, Rule as SketchRule, DoodleBand } from '@/components/sketch';
import { Doodle, CurveArrow } from '@/components/doodles';

export const metadata = { title: 'Research' };

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="grid gap-8 pb-8 pt-10 md:grid-cols-[1fr_auto] md:items-end md:pt-14">
        <div>
          <p className="label flex items-center gap-2 text-pencil">
            <span className="ring text-[15px] text-marker">01</span>
            section one
          </p>
          <h1 className="mt-4 font-marker text-[clamp(42px,7vw,70px)] leading-[0.95]">Research</h1>
          <p className="mt-5 max-w-[56ch] text-[20px] leading-snug text-pencil">
            Two programmes, and only what has been measured: what a model does with position when
            there is more of it than it can index, and what it takes for a number to mean what it
            claims.
          </p>
        </div>

        <div className="sticky w-fit rotate-[1.2deg] px-5 pb-4 pt-3">
          <p className="label text-[14px] text-ink/70">the ledger</p>
          <p className="mt-1 flex items-baseline gap-2 text-[19px]">
            <span className="tabular font-marker text-[34px] leading-none">
              {String(PROGRAMS.length).padStart(2, '0')}
            </span>
            <span className="text-pencil">programmes</span>
          </p>
          <p className="flex items-baseline gap-2 text-[19px]">
            <span className="tabular font-marker text-[34px] leading-none text-marker">
              {String(PROGRAMS.filter((p) => p.status === 'PUBLISHED').length).padStart(2, '0')}
            </span>
            <span className="text-pencil">published</span>
          </p>
        </div>
      </header>

      <SketchRule className="text-ink" />

      {PROGRAMS.map((p, i) => (
        <article key={p.slug} id={p.slug} className="scroll-mt-8 py-10">
          {i > 0 && <DoodleBand count={12} />}
          <Frame fill tape={i % 2 === 0} tilt={i % 2 === 0 ? 'l' : 'r'} className="px-6 pb-8 pt-7 md:px-9">
            <div className="flex flex-wrap items-center gap-3">
              <span className="ring text-marker">{p.id}</span>
              <h2 className="font-marker text-[30px] leading-none">{p.title}</h2>
              <span className="ml-auto">
                <Stamp color={p.status === 'PUBLISHED' ? 'var(--marker)' : 'var(--pencil)'}>
                  {p.status}
                </Stamp>
              </span>
            </div>

            <p className="mt-5 max-w-[46ch] text-[24px] leading-tight text-ink">{p.lead}</p>
            <p className="mt-4 max-w-[64ch] text-[18px] leading-[1.55] text-pencil">{p.summary}</p>

            <div className="mt-7 grid gap-8 md:grid-cols-2">
              <div>
                <p className="label flex items-center gap-2 text-pencil">
                  <Doodle name="asterisk" className="h-4 w-4 text-marker" strokeWidth={3.2} />
                  how it is done
                </p>
                <ol className="doodle-list mt-3 space-y-2.5 text-[17.5px] leading-snug text-pencil">
                  {p.approach.map((a, j) => (
                    <li key={j}>{a}</li>
                  ))}
                </ol>
              </div>

              {p.outputs && p.outputs.length > 0 && (
                <div>
                  <p className="label flex items-center gap-2 text-pencil">
                    <Doodle name="book" className="h-4 w-4 text-marker" strokeWidth={3} />
                    what came out
                  </p>
                  <ul className="mt-3 space-y-3">
                    {p.outputs.map((o) => (
                      <li key={o.href}>
                        {o.external ? (
                          <a href={o.href} target="_blank" rel="noreferrer" className="btn">
                            {o.label}
                            <Doodle name="arrow" className="h-4 w-4" strokeWidth={3} />
                          </a>
                        ) : (
                          <Link href={o.href} className="btn">
                            {o.label}
                            <Doodle name="arrow" className="h-4 w-4" strokeWidth={3} />
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Frame>
        </article>
      ))}

      <section className="mx-auto mt-6 max-w-[64ch] pb-14">
        <div className="flex items-start gap-4">
          <CurveArrow className="mt-1 h-12 w-14 shrink-0 text-marker" />
          <div>
            <p className="font-marker text-[24px] leading-tight">How the work is run.</p>
            <ol className="doodle-list mt-4 space-y-3 text-[18px] leading-snug text-pencil">
              <li>
                <span className="text-ink">One variable per experiment.</span> If two things change,
                the result is a joint effect and is labelled as one.
              </li>
              <li>
                <span className="text-ink">Margins before data.</span> The practical margin is
                written down before the run; the analysis method is named pre-specified or post hoc.
              </li>
              <li>
                <span className="text-ink">Records ship.</span> Raw records, per-item indicators and
                a verification manifest accompany every result.
              </li>
              <li>
                <span className="text-ink">Corrections get a log.</span> Verdicts that change are
                recorded as changed.
              </li>
            </ol>
            <p className="mt-5 text-[17px] text-pencil">
              Work in progress is marked <span className="swipe text-ink">active</span> or{' '}
              <span className="swipe text-ink">planned</span> and carries no results until there are
              records to show.
            </p>
            <p className="mt-6">
              <Link href="/publications" className="link text-[18px]">
                publications
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
