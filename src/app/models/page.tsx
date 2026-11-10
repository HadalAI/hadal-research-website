import Link from 'next/link';
import { MODELS, PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Models' };

export default function ModelsPage() {
  const model = MODELS[0];

  return (
    <main className="mx-auto max-w-page px-6 md:px-10">
      <header className="grid gap-10 border-b border-rule py-14 md:grid-cols-[1fr_260px] md:items-end">
        <div>
          <p className="mono-label">Section 04</p>
          <h1 className="mt-5 font-sans text-[clamp(40px,6vw,64px)] font-medium leading-[0.96] tracking-[-0.03em]">
            Models
          </h1>
          <p className="mt-6 max-w-[52ch] font-serif text-[18px] leading-[1.55] text-muted">
            The lab builds its own models so architecture questions can be asked at a scale we
            control. Nothing is published until it can be evaluated against the probes in the
            agenda.
          </p>
        </div>
        <dl className="border-t border-rule pt-4 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <div className="flex justify-between gap-4">
            <dt className="mono-label">Released</dt>
            <dd className="tabular font-mono text-[11px]">00</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="mono-label">In design</dt>
            <dd className="tabular font-mono text-[11px]">01</dd>
          </div>
        </dl>
      </header>

      <article className="grid gap-8 border-b border-rule py-12 md:grid-cols-[5rem_1fr]">
        <div>
          <p className="mono-label tabular">01</p>
          <p className="mono-label mt-2">{model.status}</p>
        </div>
        <div className="max-w-[64ch]">
          <h2 className="font-serif text-[34px] leading-none tracking-[-0.01em]">{model.name}</h2>
          <p className="mt-5 font-serif text-[18px] leading-[1.6] text-muted">{model.description}</p>

          <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-ink pt-5 md:grid-cols-4">
            {model.specs.map(([k, v]) => (
              <div key={k}>
                <dt className="mono-label">{k}</dt>
                <dd className="mt-1.5 font-mono text-[11.5px] leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>

          {model.notes && (
            <p className="mt-8 border-l-2 border-accent pl-5 font-serif text-[15px] italic leading-relaxed text-muted">
              {model.notes}
            </p>
          )}
        </div>
      </article>

      <section className="grid gap-8 py-14 md:grid-cols-[5rem_1fr]">
        <p className="mono-label">§ Why hybrid</p>
        <div className="max-w-[64ch] space-y-4 font-serif text-[17px] leading-[1.6] text-muted">
          <p>
            Attention is the expensive part of a transformer, and not every block needs it. The
            question this lab is built around is which parts do — and whether a hybrid stack can
            keep the retrieval behaviour of attention while paying recurrent cost for the rest.
          </p>
          <p>
            HADAL-1 is the vehicle for that question, not a product. Its evaluation set comes from{' '}
            <Link href="/research#hybrid-architectures" className="link">
              program 01
            </Link>{' '}
            and the long-context probes in{' '}
            <Link href="/research#long-context" className="link">
              program 02
            </Link>
            . {PROGRAMS.length} programs, one model line.
          </p>
          <p className="text-[15px] text-muted/80">
            When a model ships it will be listed here with its card, its evaluation record and the
            configuration that produced it.
          </p>
        </div>
      </section>
    </main>
  );
}
