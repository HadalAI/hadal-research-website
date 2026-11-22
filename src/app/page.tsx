import Link from 'next/link';
import { PUBLICATIONS, PROGRAMS, MODELS } from '@/lib/lab';

function excerpt(text: string, n: number) {
  if (text.length <= n) return text;
  const cut = text.slice(0, n);
  const at = cut.lastIndexOf(' ');
  return `${cut.slice(0, at > 0 ? at : n)}…`;
}

export default function HomePage() {
  const paper = PUBLICATIONS[0];
  const model = MODELS[0];

  return (
    <main className="sheet">
      <section className="row pt-10 pb-6">
        <div className="hang">Est. 2026</div>
        <div>
          <p className="kicker rise m-0">An independent research lab</p>
          <h1 className="hero rise rise-1 mt-2">
            Hybrid language models, measured carefully.
          </h1>
          <p className="lede rise rise-2 mt-7 max-w-[36rem]">
            We study hybrid language models — how attention, recurrence and retrieval are put
            together — and the measurement methods that decide whether a change is real.
          </p>
        </div>
      </section>

      <section className="row mt-9">
        <div className="hang">01</div>
        <div>
          <h2 className="section-title">Recent work</h2>
          {PUBLICATIONS.map((p) => (
            <article key={p.slug} className="entry">
              <p className="meta m-0 mb-1">{p.displayDate} · {p.version} · preprint</p>
              <Link href={`/blog/${p.slug}`} className="entry-title">{p.title}</Link>
              <p className="muted mt-2 mb-0 max-w-[38rem]">{excerpt(p.abstract, 230)}</p>
            </article>
          ))}
          <p className="mt-7 mb-0"><Link href="/publications">All publications</Link></p>
        </div>
      </section>

      <section className="row mt-9">
        <div className="hang">02</div>
        <div>
          <h2 className="section-title">Programmes</h2>
          <div className="hair-list">
            {PROGRAMS.map((p) => (
              <div key={p.slug}>
                <p className="m-0"><Link href={`/research#${p.slug}`}>{p.title}</Link></p>
                <p className="muted m-0 mt-1">{p.lead}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="row mt-9">
        <div className="hang">03</div>
        <div>
          <h2 className="section-title">The model</h2>
          <p className="m-0"><span className="mono-label">{model.status}</span></p>
          <p className="m-0 mt-1"><Link href="/models" className="entry-title">{model.name}</Link></p>
          <p className="muted mt-2 mb-0 max-w-[38rem]">{model.description}</p>
        </div>
      </section>

      <section className="row mt-9">
        <div className="hang">04</div>
        <div>
          <h2 className="section-title">How we work</h2>
          <p>
            One variable per experiment. Practical margins are written down before the run, and
            anything chosen afterwards is labelled as such. Negative results ship with the positive
            ones, and the analysis path runs on the Python standard library alone.
          </p>
          <p className="mb-0">
            <Link href="/research">The agenda</Link> · <Link href={`/blog/${paper.slug}`}>The latest paper</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
