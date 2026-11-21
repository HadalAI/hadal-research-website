import Link from 'next/link';
import { MODELS, PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Models' };

export default function ModelsPage() {
  const model = MODELS[0];
  return (
    <main className="shell pb-4">
      <header className="pt-14 pb-10">
        <h1 className="display page-title m-0">Models</h1>
        <p className="lede mt-6 mb-0">
          The lab builds its own models so architecture questions can be asked at a scale we control.
          Nothing is published until it can be evaluated against the probes in the agenda.
        </p>
      </header>

      <div className="stack">
        <section>
          <p className="label mb-2">{model.status}</p>
          <h2 className="section-title">{model.name}</h2>
          <p className="muted">{model.description}</p>
          <dl className="rule-list mt-6">
            {model.specs.map(([k, v]) => (
              <div key={k} className="flex flex-wrap items-baseline justify-between gap-4">
                <dt className="label">{k}</dt>
                <dd className="m-0 text-[0.95rem]">{v}</dd>
              </div>
            ))}
          </dl>
          {model.notes && <p className="meta mt-6 mb-0">{model.notes}</p>}
        </section>

        <section>
          <h2 className="section-title">Why hybrid</h2>
          <p>
            Attention is the expensive part of a transformer, and not every block needs it. The question
            this lab is built around is which parts do — and whether a hybrid stack can keep the retrieval
            behaviour of attention while paying recurrent cost for the rest.
          </p>
          <p className="mb-0">
            HADAL-1 is the vehicle for that question, not a product. Its evaluation set comes from the{' '}
            <Link href="/research#long-context">long-context programme</Link>. {PROGRAMS.length} programmes, one model line.
          </p>
        </section>
      </div>
    </main>
  );
}
