import Link from 'next/link';
import Doodle from '@/components/doodles';
import { Paper, SectionTitle, HandRule, DoodleRow, Circled, PointArrow } from '@/components/sketch';
import { PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Research' };

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label flex items-center gap-2">
              <Doodle name="compass" className="h-6 w-6 text-marker" /> section one
            </p>
            <h1 className="mt-3 font-marker text-[clamp(44px,7vw,72px)] leading-none">Research</h1>
            <p className="mt-5 max-w-[56ch] text-[20px] leading-snug">
              Two programmes, and only what has been measured: what a model does with position when
              there is more of it than it can index, and what it takes for a number to mean what it claims.
            </p>
          </div>
          <Paper variant={1} tilt="l">
            <p className="label">the ledger</p>
            <p className="mt-1 flex items-center gap-3 text-[19px]">
              <Circled className="font-marker text-[32px]">{String(PROGRAMS.length).padStart(2, '0')}</Circled>
              programmes
            </p>
            <p className="mt-1 flex items-center gap-3 text-[19px]">
              <Circled className="font-marker text-[32px] text-marker">
                {String(PROGRAMS.filter((p) => p.status === 'PUBLISHED').length).padStart(2, '0')}
              </Circled>
              published
            </p>
          </Paper>
        </div>
        <DoodleRow count={12} className="justify-start !pb-0" />
      </header>

      <HandRule />

      {PROGRAMS.map((p, i) => (
        <section key={p.slug} id={p.slug} className="mb-10 scroll-mt-8">
          {i > 0 && <DoodleRow count={10} />}
          <Paper variant={(i + 2) as 2 | 3} tilt={i % 2 === 0 ? 'l' : 'r'}>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-marker text-[34px] text-marker">{p.id}</span>
              <h2 className="font-marker text-[30px] leading-none">{p.title}</h2>
              <span className="ml-auto"><Circled className="note text-[18px] font-semibold uppercase text-marker">{p.status}</Circled></span>
            </div>

            <div className="mt-5 flex items-start gap-3">
              <Doodle name="eye" className="mt-1 h-7 w-7 shrink-0 text-marker" />
              <p className="max-w-[48ch] font-marker text-[24px] leading-tight">{p.lead}</p>
            </div>
            <p className="mt-4 max-w-[64ch] text-[19px] leading-snug">{p.summary}</p>

            <div className="mt-6 grid gap-7 md:grid-cols-2">
              <div>
                <p className="label flex items-center gap-2">
                  <Doodle name="asterisk" className="h-5 w-5 text-marker" /> how it is done
                </p>
                <ul className="doodle-list mt-2 space-y-2 text-[18px] leading-snug">
                  {p.approach.map((a, j) => <li key={j}>{a}</li>)}
                </ul>
              </div>
              <div>
                <p className="label flex items-center gap-2">
                  <Doodle name="book" className="h-5 w-5 text-marker" /> what came out
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {p.outputs?.map((o) => (
                    <Link key={o.href} href={o.href} className="btn">
                      {o.label}
                      <Doodle name="arrow" className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
                <PointArrow className="mt-2" />
              </div>
            </div>
          </Paper>
        </section>
      ))}

      <HandRule />

      <section className="mx-auto max-w-[64ch] pb-12">
        <SectionTitle icon="pencil">How the work is run</SectionTitle>
        <ul className="doodle-list mt-5 space-y-3 text-[19px] leading-snug">
          <li><span className="highlight">One variable per experiment.</span> If two things change, the result is a joint effect and is labelled as one.</li>
          <li><span className="highlight">Margins before data.</span> The practical margin is written down before the run; the method is named pre-specified or post hoc.</li>
          <li><span className="highlight">Records ship.</span> Raw records, per-item indicators and a verification manifest accompany every result.</li>
          <li><span className="highlight">Corrections get a log.</span> Verdicts that change are recorded as changed.</li>
        </ul>
        <p className="mt-5 flex items-center gap-2 text-[18px]">
          <Doodle name="arrow" className="h-5 w-5 text-marker" />
          <Link href="/publications" className="link">publications</Link>
        </p>
      </section>
    </main>
  );
}
