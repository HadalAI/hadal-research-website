import Link from 'next/link';
import { PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Research' };

export default function ResearchPage() {
  return (
    <main className="sheet">
      <section className="row pt-10 pb-0">
        <div className="hang">Research</div>
        <div>
          <h1 className="page-title">Two programmes,<br />and only what has been measured.</h1>
          <p className="lede mt-6 mb-0 max-w-[34rem]">
            What a model does with position when there is more of it than it can index, and what it
            takes for a number to mean what it claims.
          </p>
        </div>
      </section>

      {PROGRAMS.map((p, i) => (
        <section key={p.slug} id={p.slug} className="row mt-10 scroll-mt-10">
          <div className="hang">{p.id} · {p.status}</div>
          <div>
            <h2 className="section-title">{p.title}</h2>
            <p className="lede mt-2">{p.lead}</p>
            <p className="muted">{p.summary}</p>

            <h3 className="mono-label mt-8 mb-3">Approach</h3>
            <ul className="muted mb-0 pl-4">
              {p.approach.map((a, j) => <li key={j} className="mb-2">{a}</li>)}
            </ul>

            {p.outputs?.length ? (
              <p className="mt-7 mb-0">
                {p.outputs.map((o, j) => (
                  <span key={o.href}>
                    {j > 0 && <span className="muted"> · </span>}
                    <Link href={o.href}>{o.label}</Link>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </section>
      ))}

      <section className="row mt-10">
        <div className="hang">Notes</div>
        <div>
          <h2 className="section-title">How the work is run</h2>
          <ul className="muted mb-0 pl-4">
            <li className="mb-2"><span className="text-ink">One variable per experiment.</span> If two things change, the result is a joint effect and is labelled as one.</li>
            <li className="mb-2"><span className="text-ink">Margins before data.</span> The practical margin is written down before the run; the method is named pre-specified or post hoc.</li>
            <li className="mb-2"><span className="text-ink">Records ship.</span> Raw records, per-item indicators and a verification manifest accompany every result.</li>
            <li><span className="text-ink">Corrections get a log.</span> Verdicts that change are recorded as changed.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
