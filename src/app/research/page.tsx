import Link from 'next/link';
import { PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Research' };

export default function ResearchPage() {
  return (
    <main className="shell pb-4">
      <header className="pt-14 pb-10">
        <h1 className="display page-title m-0">Research</h1>
        <p className="lede mt-6 mb-0">
          Two programmes, and only what has been measured: what a model does with position when
          there is more of it than it can index, and what it takes for a number to mean what it claims.
        </p>
      </header>

      <div className="stack">
        {PROGRAMS.map((p) => (
          <section key={p.slug} id={p.slug} className="scroll-mt-24">
            <p className="label mb-2">{p.id} · {p.status}</p>
            <h2 className="section-title">{p.title}</h2>
            <p className="lede">{p.lead}</p>
            <p className="muted">{p.summary}</p>
            <h3 className="label mt-7 mb-2">Approach</h3>
            <ul className="muted mb-0 pl-5">
              {p.approach.map((a, i) => <li key={i} className="mb-2">{a}</li>)}
            </ul>
            {p.outputs?.length ? (
              <p className="mt-6 mb-0">
                {p.outputs.map((o, i) => (
                  <span key={o.href}>
                    {i > 0 && <span className="faint"> · </span>}
                    <Link href={o.href}>{o.label}</Link>
                  </span>
                ))}
              </p>
            ) : null}
          </section>
        ))}

        <section>
          <h2 className="section-title">How the work is run</h2>
          <ul className="muted mb-0 pl-5">
            <li className="mb-2"><span className="text-ink">One variable per experiment.</span> If two things change, the result is a joint effect and is labelled as one.</li>
            <li className="mb-2"><span className="text-ink">Margins before data.</span> The practical margin is written down before the run; the method is named pre-specified or post hoc.</li>
            <li className="mb-2"><span className="text-ink">Records ship.</span> Raw records, per-item indicators and a verification manifest accompany every result.</li>
            <li><span className="text-ink">Corrections get a log.</span> Verdicts that change are recorded as changed.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
