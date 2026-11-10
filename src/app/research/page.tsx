import Link from 'next/link';
import { PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Research' };

const statusClass = (status: string) =>
  status === 'PUBLISHED' ? 'text-accent' : status === 'ACTIVE' ? 'text-ink' : 'text-muted';

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-page px-6 md:px-10">
      <header className="grid gap-10 border-b border-rule py-14 md:grid-cols-[1fr_260px] md:items-end">
        <div>
          <p className="mono-label">Section 01</p>
          <h1 className="mt-5 font-sans text-[clamp(40px,6vw,64px)] font-medium leading-[0.96] tracking-[-0.03em]">
            Research
          </h1>
          <p className="mt-6 max-w-[52ch] font-serif text-[18px] leading-[1.55] text-muted">
            Four programs, one question each. Hybrid model design is the through-line: where
            attention is still worth its cost, what a model does with position when it has less of
            it, and how to tell a real effect from a lucky run.
          </p>
        </div>
        <dl className="border-t border-rule pt-4 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <div className="flex justify-between gap-4">
            <dt className="mono-label">Programs</dt>
            <dd className="tabular font-mono text-[11px]">04</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="mono-label">Published</dt>
            <dd className="tabular font-mono text-[11px]">01</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="mono-label">Planned</dt>
            <dd className="tabular font-mono text-[11px]">01</dd>
          </div>
        </dl>
      </header>

      {PROGRAMS.map((p) => (
        <article
          key={p.slug}
          id={p.slug}
          className="grid scroll-mt-8 gap-8 border-b border-rule py-12 md:grid-cols-[5rem_1fr]"
        >
          <div>
            <p className="mono-label tabular">{p.id}</p>
            <p className={`mono-label mt-2 ${statusClass(p.status)}`}>{p.status}</p>
          </div>

          <div className="max-w-[64ch]">
            <h2 className="font-serif text-[28px] leading-tight tracking-[-0.01em]">{p.title}</h2>
            <p className="mt-3 font-serif text-[19px] leading-[1.5] text-ink/90">{p.lead}</p>
            <p className="mt-5 font-serif text-[16px] leading-[1.65] text-muted">{p.summary}</p>

            <p className="mono-label mt-8">Approach</p>
            <ol className="mt-3 space-y-3">
              {p.approach.map((a, i) => (
                <li key={i} className="font-serif text-[15.5px] leading-relaxed text-muted">
                  <span className="mono-label tabular mr-3 text-[9.5px] align-[0.25em]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {a}
                </li>
              ))}
            </ol>

            {p.outputs && p.outputs.length > 0 && (
              <>
                <p className="mono-label mt-8">Output</p>
                <ul className="mt-3 space-y-2">
                  {p.outputs.map((o) => (
                    <li key={o.href} className="font-serif text-[16px]">
                      {o.external ? (
                        <a href={o.href} target="_blank" rel="noreferrer" className="link">
                          {o.label} ↗
                        </a>
                      ) : (
                        <Link href={o.href} className="link">
                          {o.label} →
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </article>
      ))}

      <section className="grid gap-8 py-14 md:grid-cols-[5rem_1fr]">
        <p className="mono-label">§ Notes</p>
        <div className="max-w-[64ch]">
          <p className="font-serif text-[20px] leading-snug">How the work is run.</p>
          <ol className="mt-5 space-y-4 font-serif text-[16px] leading-relaxed text-muted">
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
          <p className="mt-8 font-serif text-[15px] text-muted">
            Work in progress is marked <span className="text-ink">active</span> or{' '}
            <span className="text-ink">planned</span> and carries no results until there are
            records to show.
          </p>
          <p className="mt-8">
            <Link href="/publications" className="link font-serif text-[16px]">
              Publications →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
