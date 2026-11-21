import Link from 'next/link';
import { PUBLICATIONS, PROGRAMS } from '@/lib/lab';

export default function HomePage() {
  const recent = PUBLICATIONS[0];
  return (
    <main className="shell pb-4">
      <section className="pt-16 pb-14 text-center">
        <h1 className="display hero-title rise m-0">Hadal<br />Research</h1>
        <p className="meta rise rise-1 mt-7 mb-0">Intelligence, built together</p>
      </section>

      <div className="stack">
        <section className="rise rise-2">
          <p className="lede">
            Hadal Research is a small lab studying hybrid language models — how attention,
            recurrence and retrieval are combined — and the measurement methods that decide
            whether a change is real.
          </p>
          <p>
            We publish the records with every result: raw predictions, the analysis code, and a
            correction log when a verdict changes. Nothing here is announced before it has been
            measured.
          </p>
        </section>

        <section>
          <h2 className="section-title">Recent work</h2>
          <div>
            {PUBLICATIONS.map((p) => (
              <article key={p.slug} className="entry">
                <p className="entry-meta">{p.displayDate} · {p.version} · preprint</p>
                <Link href={`/blog/${p.slug}`} className="entry-title">{p.title}</Link>
                <p className="mt-2 mb-0 muted">{p.abstract.slice(0, 240)}…</p>
              </article>
            ))}
          </div>
          <p className="mt-8 mb-0">
            <Link href="/publications">All publications</Link>
          </p>
        </section>

        <section>
          <h2 className="section-title">Programmes</h2>
          <div className="rule-list">
            {PROGRAMS.map((p) => (
              <div key={p.slug}>
                <p className="mb-1">
                  <Link href={`/research#${p.slug}`}>{p.title}</Link>
                </p>
                <p className="muted mb-0">{p.lead}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">How we work</h2>
          <p>
            One variable per experiment. Practical margins are written down before the run, and
            anything chosen afterwards is labelled as such. Negative results ship with the positive
            ones, and the analysis path runs on the Python standard library alone.
          </p>
          <p className="mb-0">
            <Link href="/research">Read the agenda</Link> · <Link href={`/blog/${recent.slug}`}>Read the latest paper</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
