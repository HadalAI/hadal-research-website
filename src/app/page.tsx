import Link from 'next/link';
import HeroDoodle from '@/components/hero-doodle';
import CopyValue from '@/components/copy-value';
import { Frame, Circled, Rule as SketchRule, Stamp } from '@/components/sketch';
import { Doodle } from '@/components/doodles';
import { MODELS, PROGRAMS, PUBLICATIONS } from '@/lib/lab';

const CONTENTS = [
  {
    href: '/research',
    title: 'Research',
    note: 'Two programmes, published results only: what long context gets wrong, and what makes a number mean what it claims.',
    meta: '2 programmes',
    icon: 'compass' as const,
  },
  {
    href: '/publications',
    title: 'Publications',
    note: 'Preprints with their records, code and correction logs attached.',
    meta: '2 papers',
    icon: 'book' as const,
  },
  {
    href: '/blog',
    title: 'Notes',
    note: 'Method notes from the bench, written when there is something to record.',
    meta: '3 entries',
    icon: 'pencil' as const,
  },
  {
    href: '/models',
    title: 'Models',
    note: 'HADAL-1, the vehicle for the architecture questions. Nothing released.',
    meta: '0 released',
    icon: 'bulb' as const,
  },
];

export default function HomePage() {
  const paper = PUBLICATIONS[0];
  const model = MODELS[0];

  return (
    <main>
      {/* ---------------------------------------------------------------- cover */}
      <section className="mx-auto max-w-page px-5 pb-10 pt-10 md:px-10 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div>
            <p className="rise label flex items-center gap-2 text-pencil">
              <Doodle name="asterisk" className="h-4 w-4 text-marker" strokeWidth={3.4} />
              an independent research lab
            </p>

            <h1 className="rise rise-1 mt-5 font-marker text-[clamp(46px,8vw,86px)] leading-[0.92] tracking-tight">
              Research,
              <br />
              <Circled className="text-ink">at depth.</Circled>
            </h1>

            <p className="rise rise-2 mt-8 max-w-[46ch] text-[20px] leading-[1.5] text-pencil">
              We study hybrid language models — how attention, recurrence and retrieval are put
              together — and the measurement methods that decide whether a change is{' '}
              <span className="swipe text-ink">real</span>.
            </p>

            <div className="rise rise-3 mt-8 flex flex-wrap items-center gap-4">
              <Link href="/research" className="btn">
                read the agenda
                <Doodle name="arrow" className="h-5 w-5" strokeWidth={2.8} />
              </Link>
              <Link href={`/blog/${paper.slug}`} className="link text-[19px]">
                read the latest paper
              </Link>
            </div>

            <p className="rise rise-4 mt-8 flex items-center gap-3 text-[17px] text-pencil">
              <Doodle name="pin" className="h-5 w-5 text-marker" />
              Everything here is measured. Nothing here is promised.
            </p>
          </div>

          <div className="relative">
            <HeroDoodle className="w-full text-ink" />
            <p className="note absolute -bottom-2 right-2 rotate-[-2deg] text-[19px] text-pencil">
              fig. 1 — the descent
            </p>
          </div>
        </div>
      </section>

      <SketchRule className="text-ink" />

      {/* ---------------------------------------------------------------- contents */}
      <section className="mx-auto max-w-page px-5 py-12 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-marker text-[30px] leading-none">Contents</h2>
          <p className="label text-pencil">four sheets, no filler</p>
        </div>

        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {CONTENTS.map((c, i) => (
            <li key={c.href}>
              <Link href={c.href} className="block">
                <Frame
                  fill
                  tape={i % 2 === 0}
                  tilt={i % 3 === 0 ? 'l' : i % 3 === 1 ? 'r' : 'none'}
                  className="hover-tilt h-full px-6 pb-6 pt-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="ring text-marker">{String(i + 1).padStart(2, '0')}</span>
                    <Doodle name={c.icon} className="h-9 w-9 text-ink/70" strokeWidth={2.5} />
                  </div>
                  <p className="mt-3 font-marker text-[27px] leading-none">{c.title}</p>
                  <p className="mt-2.5 max-w-[42ch] text-[17px] leading-snug text-pencil">
                    {c.note}
                  </p>
                  <p className="mt-4 flex items-center gap-2 text-[16px] text-ink/70">
                    <Doodle name="bookmark" className="h-4 w-4 text-marker" strokeWidth={3} />
                    {c.meta}
                  </p>
                </Frame>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- recent paper */}
      <section className="mx-auto max-w-page px-5 pb-4 md:px-10">
        <Frame tape tilt="r" className="px-6 pb-8 pt-9 md:px-9">
          <div className="grid gap-9 lg:grid-cols-[1.5fr_0.75fr]">
            <div>
              <p className="label flex items-center gap-2 text-marker">
                <Doodle name="star" className="h-4 w-4" strokeWidth={3} />
                recent paper
              </p>
              <h2 className="mt-3 max-w-[30ch] text-[30px] leading-[1.12] md:text-[34px]">
                <Link href={`/blog/${paper.slug}`} className="hover:text-marker">
                  {paper.title}
                </Link>
              </h2>
              <p className="mt-3 text-[17px] text-pencil">
                {paper.authors} · {paper.displayDate} · {paper.version} · preprint
              </p>
              <p className="mt-5 max-w-[62ch] text-[18px] leading-[1.55] text-ink/85">
                {paper.abstract}
              </p>
              <p className="mt-6 flex flex-wrap items-center gap-4">
                <Link href={`/blog/${paper.slug}`} className="btn btn-red">
                  read it
                  <Doodle name="arrow" className="h-4 w-4" strokeWidth={3} />
                </Link>
                <a
                  href="https://github.com/okyssta/llm-midpoint-anchor-study"
                  target="_blank"
                  rel="noreferrer"
                  className="link text-[18px]"
                >
                  records &amp; code
                </a>
              </p>
            </div>

            <aside className="relative">
              <div className="sticky rotate-[-1.4deg] px-5 pb-5 pt-4">
                <p className="label text-ink/70">headline result</p>
                <div className="mt-1">
                  <CopyValue
                    value="−33.3"
                    copy="−33.3 pp (95% CI [−51.2, −11.6], exact McNemar p = 0.00781), Qwen2.5-1.5B-Instruct, L=9"
                    hint="click to copy the figure"
                    className="tabular font-marker text-[52px] leading-none text-ink"
                  />
                </div>
                <p className="mt-1 text-[16px] text-ink/70">pp · backward vs forward</p>
                <dl className="mt-3 space-y-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="label text-[15px] text-pencil">95% ci</dt>
                    <dd className="tabular text-[17px]">[−51.2, −11.6]</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="label text-[15px] text-pencil">exact p</dt>
                    <dd className="tabular text-[17px]">0.00781</dd>
                  </div>
                </dl>
                <p className="mt-2 text-[16px] leading-snug text-ink/70">
                  margin not cleared · Qwen2.5-1.5B
                </p>
              </div>
            </aside>
          </div>
        </Frame>
      </section>

      {/* ---------------------------------------------------------------- model + method */}
      <section className="mx-auto grid max-w-page gap-10 px-5 py-14 md:grid-cols-2 md:gap-14 md:px-10">
        <div>
          <p className="label flex items-center gap-2 text-pencil">
            <Doodle name="bulb" className="h-4 w-4 text-marker" strokeWidth={3} />
            the model
          </p>
          <p className="mt-3 flex items-baseline gap-3 font-marker text-[32px] leading-none">
            {model.name}
            <Stamp className="translate-y-0.5">{model.status}</Stamp>
          </p>
          <p className="mt-4 text-[18px] leading-snug text-pencil">{model.description}</p>
          <dl className="mt-6">
            {model.specs.map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-6 border-b border-dashed border-ink/30 py-2 last:border-0"
              >
                <dt className="label shrink-0 text-[14px] text-pencil">{k}</dt>
                <dd className="text-right text-[16px] leading-tight">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="label flex items-center gap-2 text-pencil">
            <Doodle name="flask" className="h-4 w-4 text-marker" strokeWidth={3} />
            the method
          </p>
          <p className="mt-3 font-marker text-[26px] leading-tight">
            Small studies, rebuilt from their records.
          </p>
          <ul className="doodle-list mt-5 space-y-3 text-[18px] leading-snug text-pencil">
            <li>
              <span className="text-ink">Decision rules before data.</span> Margins are fixed ahead
              of the run and labelled apart from anything chosen afterwards.
            </li>
            <li>
              <span className="text-ink">Paired by item.</span> One variable per contrast, so a
              difference can only come from the thing we changed.
            </li>
            <li>
              <span className="text-ink">Negative results ship.</span> A cell with no effect is part
              of the result, not a footnote.
            </li>
            <li>
              <span className="text-ink">Nothing to install.</span> The analysis path runs on the
              Python standard library alone.
            </li>
          </ul>
          <p className="mt-6">
            <Link href="/research#measurement" className="link text-[18px]">
              read the method
            </Link>
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- currently */}
      <section className="mx-auto max-w-page px-5 pb-16 md:px-10">
        <Frame thin tilt="l" className="px-6 py-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="label text-pencil">currently</p>
            <Link href="/research" className="link text-[17px]">
              all programmes
            </Link>
          </div>
          <ul className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-2">
            {PROGRAMS.map((p, i) => (
              <li key={p.slug} className="flex items-center gap-3">
                <span className="ring text-[16px] text-marker">{p.id}</span>
                <span className="text-[18px]">{p.title}</span>
                <span className="ml-auto">
                  <Stamp color={p.status === 'PUBLISHED' ? 'var(--marker)' : 'var(--pencil)'}>
                    {p.status}
                  </Stamp>
                </span>
              </li>
            ))}
          </ul>
        </Frame>
      </section>
    </main>
  );
}
