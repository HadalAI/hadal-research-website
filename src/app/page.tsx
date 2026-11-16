import Link from 'next/link';
import HeroDoodle from '@/components/hero-doodle';
import DoodleChart from '@/components/doodle-chart';
import Doodle from '@/components/doodles';
import type { DoodleName } from '@/components/doodles';
import { Paper, SectionTitle, HandRule, DoodleRow, Circled, PointArrow } from '@/components/sketch';
import { MODELS, PROGRAMS, PUBLICATIONS } from '@/lib/lab';

const CONTENTS: { href: string; title: string; note: string; meta: string; icon: DoodleName }[] = [
  { href: '/research', title: 'Research', note: 'Two programmes, published results only: what long context gets wrong, and what makes a number mean what it claims.', meta: '2 programmes', icon: 'compass' },
  { href: '/publications', title: 'Publications', note: 'Preprints with their records, code and correction logs attached.', meta: '2 papers', icon: 'book' },
  { href: '/blog', title: 'Notes', note: 'Method notes from the bench, written when there is something to record.', meta: '3 entries', icon: 'pencil' },
  { href: '/models', title: 'Models', note: 'HADAL-1, the vehicle for the architecture questions. Nothing released.', meta: '0 released', icon: 'bulb' },
];

export default function HomePage() {
  const paper = PUBLICATIONS[0];
  const model = MODELS[0];

  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      {/* ------------------------------------------------------------- cover */}
      <section className="grid items-center gap-8 pt-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="label flex items-center gap-2">
            <Doodle name="arrow" className="h-5 w-5 text-marker" />
            an independent research lab
          </p>

          <h1 className="mt-4 font-marker text-[clamp(46px,8vw,88px)] leading-[0.93]">
            Research,
            <br />
            <Circled>at depth.</Circled>
          </h1>

          <div className="mt-6 flex items-start gap-3">
            <Doodle name="star" className="mt-1 h-7 w-7 shrink-0 text-marker" />
            <p className="max-w-[46ch] text-[20px] leading-snug">
              We study hybrid language models — how attention, recurrence and retrieval are put
              together — and the measurement methods that decide whether a change is{' '}
              <span className="highlight">real</span>.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link href="/research" className="btn">
              read the agenda
              <Doodle name="arrow" className="h-5 w-5" />
            </Link>
            <Link href={`/blog/${paper.slug}`} className="link text-[19px]">
              read the latest paper
            </Link>
            <Doodle name="smile" className="h-7 w-7 text-marker" />
          </div>

          <p className="mt-6 flex items-center gap-2 text-[18px] text-pencil">
            <Doodle name="check" className="h-5 w-5 text-marker" />
            Everything here is measured. Nothing here is promised.
          </p>
        </div>

        <div className="relative">
          <HeroDoodle className="w-full" />
          <p className="scrawl absolute bottom-1 right-2">fig. 1 — the descent</p>
        </div>
      </section>

      <HandRule />

      {/* ---------------------------------------------------------- contents */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionTitle icon="bookmark">Contents</SectionTitle>
          <p className="scrawl">four sheets, no filler</p>
        </div>

        <div className="mt-8 grid gap-7 md:grid-cols-2">
          {CONTENTS.map((c, i) => (
            <Link key={c.href} href={c.href} className="hover-doodle">
              <Paper variant={(i % 4) as 0 | 1 | 2 | 3} tilt={i % 2 === 0 ? 'l' : 'r'}>
                <div className="flex items-start justify-between">
                  <span className="font-marker text-[30px] text-marker">{String(i + 1).padStart(2, '0')}</span>
                  <Doodle name={c.icon} className="h-10 w-10" strokeWidth={2.4} />
                </div>
                <p className="mt-2 font-marker text-[29px] leading-none">{c.title}</p>
                <p className="mt-2 max-w-[42ch] text-[18px] leading-snug">{c.note}</p>
                <p className="mt-3 flex items-center gap-2 text-[17px] text-pencil">
                  <Doodle name="star" className="h-4 w-4 text-marker" />
                  {c.meta}
                </p>
              </Paper>
            </Link>
          ))}
        </div>
      </section>

      <HandRule />

      {/* ------------------------------------------------------ recent paper */}
      <section>
        <p className="label flex items-center gap-2">
          <Doodle name="star" className="h-5 w-5 text-marker" />
          recent paper
        </p>
        <div className="mt-4 grid items-center gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <Paper variant={2} tilt="r">
            <h2 className="max-w-[34ch] font-marker text-[30px] leading-tight md:text-[34px]">
              <Link href={`/blog/${paper.slug}`} className="hover:text-marker">{paper.title}</Link>
            </h2>
            <p className="mt-2 flex items-center gap-2 text-[17px] text-pencil">
              <Doodle name="pencil" className="h-4 w-4 text-marker" />
              {paper.authors} · {paper.displayDate} · {paper.version} · preprint
            </p>
            <p className="mt-4 max-w-[62ch] text-[18px] leading-snug">{paper.abstract}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link href={`/blog/${paper.slug}`} className="btn">
                read it
                <Doodle name="arrow" className="h-4 w-4" />
              </Link>
              <Link href={paper.links.find((l) => l.label.includes('records'))?.href ?? '/blog'} className="link text-[18px]">
                records &amp; code
              </Link>
              <Doodle name="spiral" className="h-7 w-7 text-marker" />
            </div>
          </Paper>

          <div>
            <DoodleChart
              bars={[
                { label: 'by frame', value: 99.8, display: '99.8%', color: 'var(--marker)' },
                { label: 'by .strip()', value: 0.9, display: '0.9%' },
              ]}
              caption="same model · 1,762 files · no model in the loop"
            />
            <div className="flex justify-center"><PointArrow className="h-14 w-20" /></div>
          </div>
        </div>
      </section>

      <HandRule />

      {/* --------------------------------------------------- model + method */}
      <section className="grid gap-8 md:grid-cols-2">
        <Paper variant={1} tilt="l">
          <p className="label flex items-center gap-2">
            <Doodle name="bulb" className="h-5 w-5 text-marker" /> the model
          </p>
          <p className="mt-2 flex items-center gap-3 font-marker text-[32px]">
            {model.name}
            <Doodle name="clock" className="h-6 w-6 text-marker" />
          </p>
          <p className="mt-3 text-[18px] leading-snug">{model.description}</p>
          <div className="mt-4">
            {model.specs.map(([k, v]) => (
              <p key={k} className="flex items-baseline justify-between gap-4 border-b border-dashed border-ink/25 py-1.5">
                <span className="note">{k}</span><span className="text-right text-[17px]">{v}</span>
              </p>
            ))}
          </div>
        </Paper>

        <Paper variant={3} tilt="r">
          <p className="label flex items-center gap-2">
            <Doodle name="flask" className="h-5 w-5 text-marker" /> the method
          </p>
          <p className="mt-2 font-marker text-[26px] leading-tight">Small studies, rebuilt from their records.</p>
          <ul className="doodle-list mt-4 space-y-2 text-[18px] leading-snug">
            <li><span className="highlight">Decision rules before data.</span> Margins are fixed ahead of the run.</li>
            <li><span className="highlight">Paired by item.</span> One variable per contrast, so a difference can only come from the thing we changed.</li>
            <li><span className="highlight">Negative results ship.</span> A cell with no effect is part of the result, not a footnote.</li>
            <li><span className="highlight">Nothing to install.</span> The analysis path runs on the Python standard library.</li>
          </ul>
          <p className="mt-4 flex items-center gap-2">
            <Doodle name="arrow" className="h-5 w-5 text-marker" />
            <Link href="/research#measurement" className="link text-[18px]">read the method</Link>
          </p>
        </Paper>
      </section>

      <HandRule />

      {/* -------------------------------------------------------- currently */}
      <section className="pb-10">
        <Paper variant={0}>
          <p className="label flex items-center gap-2">
            <Doodle name="eye" className="h-5 w-5 text-marker" /> currently
          </p>
          <DoodleRow count={10} />
          <div className="grid gap-3 md:grid-cols-2">
            {PROGRAMS.map((p) => (
              <div key={p.slug} className="flex items-center gap-3">
                <span className="font-marker text-[24px] text-marker">{p.id}</span>
                <span className="text-[19px]">{p.title}</span>
                <span className="ml-auto"><Circled className="note text-[17px] font-semibold uppercase text-marker">{p.status}</Circled></span>
              </div>
            ))}
          </div>
        </Paper>
      </section>
    </main>
  );
}
