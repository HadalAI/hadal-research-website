import Link from 'next/link';
import { MODELS, PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Models' };

export default function ModelsPage() {
  const model = MODELS[0];
  return (
    <main className="sheet">
      <section className="row pt-16 pb-2">
        <div className="hang">§ Model</div>
        <div>
          <h1 className="page-title">{model.name}</h1>
          <p className="lede mt-5 mb-0 max-w-[34rem]">{model.description}</p>
        </div>
      </section>

      <section className="row mt-12">
        <div className="hang">{model.status}</div>
        <div>
          <dl className="hair-list m-0">
            {model.specs.map(([k, v]) => (
              <div key={k} className="flex flex-wrap items-baseline justify-between gap-4">
                <dt className="mono-label m-0">{k}</dt>
                <dd className="m-0 text-[0.95rem]">{v}</dd>
              </div>
            ))}
          </dl>
          {model.notes && <p className="meta mt-5 mb-0">{model.notes}</p>}
        </div>
      </section>

      <section className="row mt-14">
        <div className="hang">Why hybrid</div>
        <div>
          <p>
            Attention is the expensive part of a transformer, and not every block needs it. The question
            this lab is built around is which parts do — and whether a hybrid stack can keep the retrieval
            behaviour of attention while paying recurrent cost for the rest.
          </p>
          <p className="mb-0">
            HADAL-1 is the vehicle for that question, not a product. Its evaluation set comes from the{' '}
            <Link href="/research#long-context">long-context programme</Link>. {PROGRAMS.length} programmes, one model line.
          </p>
        </div>
      </section>
    </main>
  );
}
