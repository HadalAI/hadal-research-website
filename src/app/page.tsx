import Link from 'next/link';
import Plate from '@/components/plate';
import { MODELS, PROGRAMS, PUBLICATIONS } from '@/lib/lab';

const CONTENTS = [
  {
    href: '/research',
    title: 'Research',
    note: 'Four programs. One question each: where attention still earns its cost.',
    meta: '4 programs',
  },
  {
    href: '/publications',
    title: 'Publications',
    note: 'Preprints with their records, code and correction logs attached.',
    meta: '1 paper',
  },
  {
    href: '/blog',
    title: 'Notes',
    note: 'Method notes from the bench, written when there is something to record.',
    meta: '2 entries',
  },
  {
    href: '/models',
    title: 'Models',
    note: 'HADAL-1, the vehicle for the architecture questions. Nothing released.',
    meta: '0 released',
  },
];

export default function HomePage() {
  const paper = PUBLICATIONS[0];
  const model = MODELS[0];

  return (
    <main>
      {/* MASTHEAD */}
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-page gap-14 px-6 pb-16 pt-16 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mono-label rise">Independent research lab</p>
            <h1 className="rise rise-1 mt-7 font-serif text-[clamp(48px,8.4vw,96px)] font-normal leading-[0.92] tracking-[-0.03em]">
              Research,
              <br />
              <em className="inline-block text-muted transition-transform duration-500 ease-out hover:translate-y-[0.06em]">at depth.</em>
            </h1>
            <p className="rise rise-2 mt-9 max-w-[44ch] font-serif text-[19px] leading-[1.55] text-muted">
              Hadal Research is a small lab studying hybrid language models — how attention,
              recurrence and retrieval should be combined — and the measurement methods that
              decide whether a change is real.
            </p>
            <p className="rise rise-3 mt-9 flex flex-wrap gap-x-9 gap-y-3 font-serif text-[17px]">
              <Link href="/research" className="link">
                Research agenda →
              </Link>
              <Link href={`/blog/${paper.slug}`} className="link-accent">
                Read the paper →
              </Link>
            </p>
          </div>

          <Plate size={420} />
        </div>
      </section>

      {/* CONTENTS */}
      <section className="mx-auto max-w-page px-6 py-16 md:px-10">
        <div className="flex items-baseline justify-between">
          <p className="mono-label">Contents</p>
          <p className="mono-label">Four sections</p>
        </div>

        <ol className="mt-8 border-t border-rule">
          {CONTENTS.map((c, i) => (
            <li key={c.href} className="border-b border-rule">
              <Link
                href={c.href}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 py-7 md:grid-cols-[2.5rem_1fr_auto]"
              >
                <span className="mono-label tabular mark">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block font-serif text-[26px] leading-tight transition-colors group-hover:text-accent">
                    {c.title}
                  </span>
                  <span className="mt-1.5 block max-w-[52ch] font-serif text-[15px] leading-relaxed text-muted">
                    {c.note}
                  </span>
                </span>
                <span className="mono-label col-start-2 md:col-start-3">{c.meta}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* RECENT PAPER */}
      <section className="border-y border-rule bg-paper-2/70">
        <div className="mx-auto grid max-w-page gap-12 px-6 py-16 md:px-10 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="mono-label mark">Recent paper</p>
            <h2 className="mt-5 max-w-[26ch] font-serif text-[30px] leading-[1.12] tracking-[-0.01em] md:text-[36px]">
              <Link href={`/blog/${paper.slug}`} className="transition-colors hover:text-accent">
                {paper.title}
              </Link>
            </h2>
            <p className="mt-4 font-serif text-[15px] text-muted">
              {paper.authors} · {paper.displayDate} · {paper.version} · preprint
            </p>
            <p className="mt-6 max-w-[62ch] font-serif text-[17px] leading-[1.6] text-ink/85">
              {paper.abstract}
            </p>
            <p className="mt-7 flex flex-wrap gap-x-8 gap-y-3 font-serif text-[16px]">
              <Link href={`/blog/${paper.slug}`} className="link-accent">
                Read the paper →
              </Link>
              <a
                href="https://github.com/okyssta/llm-midpoint-anchor-study"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                Records & code ↗
              </a>
            </p>
          </div>

          <aside className="border-t border-rule pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="mono-label">Headline result</p>
            <p className="tabular mt-3 font-serif text-[54px] leading-none tracking-[-0.02em]">
              −33.3
            </p>
            <p className="mono-label mt-2">pp · backward vs forward</p>
            <dl className="mt-7 space-y-2 border-t border-rule pt-4">
              {[
                ['95% CI', '[−51.2, −11.6]'],
                ['Exact p', '0.00781'],
                ['Margin', 'not cleared'],
                ['Model', 'Qwen2.5-1.5B'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="mono-label">{k}</dt>
                  <dd className="tabular font-mono text-[11px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* MODEL + METHOD */}
      <section className="mx-auto grid max-w-page gap-12 px-6 py-16 md:grid-cols-2 md:gap-16 md:px-10">
        <div>
          <p className="mono-label">Model</p>
          <p className="mt-5 font-serif text-[30px] leading-none tracking-[-0.01em]">{model.name}</p>
          <p className="mt-4 font-serif text-[16px] leading-relaxed text-muted">{model.description}</p>
          <dl className="mt-7 border-t border-rule pt-4">
            {model.specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-rule py-2.5 last:border-0">
                <dt className="mono-label">{k}</dt>
                <dd className="font-mono text-[11px] text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="mono-label">Method</p>
          <p className="mt-5 font-serif text-[24px] leading-snug tracking-[-0.01em]">
            Small studies, rebuilt from their records.
          </p>
          <ul className="mt-6 space-y-4 font-serif text-[16px] leading-relaxed text-muted">
            <li>
              <span className="text-ink">Decision rules before data.</span> Practical margins are
              fixed ahead of the run and labelled apart from anything chosen afterwards.
            </li>
            <li>
              <span className="text-ink">Paired by item.</span> One variable per contrast, so a
              difference can only come from the thing we changed.
            </li>
            <li>
              <span className="text-ink">Negative results ship.</span> A cell with no effect is
              part of the result, not a footnote.
            </li>
            <li>
              <span className="text-ink">Nothing to install.</span> The analysis path runs on the
              Python standard library alone.
            </li>
          </ul>
          <p className="mt-7">
            <Link href="/research#measurement" className="link font-serif text-[16px]">
              Read the method →
            </Link>
          </p>
        </div>
      </section>

      {/* PROGRAMS STRIP */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-page px-6 py-10 md:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="mono-label">Currently</p>
            <p className="mono-label">
              <Link href="/research" className="link">
                All programs →
              </Link>
            </p>
          </div>
          <ul className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {PROGRAMS.map((p) => (
              <li key={p.slug} className="flex items-baseline gap-4 border-t border-rule pt-3">
                <span className="mono-label tabular">{p.id}</span>
                <span className="font-serif text-[17px]">{p.title}</span>
                <span className="mono-label ml-auto">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
