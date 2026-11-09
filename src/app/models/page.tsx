import Link from 'next/link';
import { MODELS, PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Models' };

export default function ModelsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <p className="mono-label pt-20">ARTIFACTS</p>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">MODELS</h1>
      <p className="mt-8 max-w-xl text-sm leading-relaxed text-[#8c9197]">
        The lab builds its own models so that architecture questions can be asked at the scale we can
        actually control. Nothing is published until it can be evaluated against the probes in the
        research agenda.
      </p>

      <div className="mt-16">
        {MODELS.map((m) => (
          <article key={m.id} className="record border-t hairline py-14 last:border-b">
            <div className="grid gap-10 md:grid-cols-[3rem_1fr]">
              <span className="font-mono text-xs text-[#3d434b]">01</span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <h2 className="font-mono text-4xl tracking-tight text-[#f5f5f2]">{m.name}</h2>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#555b61]">
                    {m.status}
                  </span>
                </div>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#8c9197]">{m.description}</p>

                <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t hairline pt-8 font-mono text-[11px] md:grid-cols-4">
                  {m.specs.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[#555b61]">{k}</dt>
                      <dd className="mt-2 text-[#c9cdd2]">{v}</dd>
                    </div>
                  ))}
                </dl>

                {m.notes && (
                  <p className="mt-8 border-l-2 border-[#2a3037] pl-5 font-mono text-[11px] leading-relaxed text-[#8c9197]">
                    {m.notes}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}

        <div className="border-t hairline py-10">
          <p className="font-mono text-[11px] leading-relaxed text-[#555b61]">
            No released weights. When a model ships it will be listed here with its card, evaluation
            record and the configuration that produced it.
          </p>
        </div>
      </div>

      <section className="mt-20 grid gap-10 border-t hairline pt-12 md:grid-cols-[8rem_1fr]">
        <p className="mono-label">WHY HYBRID</p>
        <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-[#8c9197]">
          <p>
            Attention is the expensive part of a transformer, and not every block needs it. The
            question this lab is built around is which parts do — and whether a hybrid stack can keep
            the retrieval behaviour of attention while paying recurrent cost for the rest.
          </p>
          <p>
            HADAL-1 is the vehicle for that question, not a product. Its evaluation set comes from{' '}
            <Link href="/research#hybrid-architectures" className="text-[#7aa7c0] underline-offset-4 hover:underline">
              program 01
            </Link>{' '}
            and the long-context probes in{' '}
            <Link href="/research#long-context" className="text-[#7aa7c0] underline-offset-4 hover:underline">
              program 02
            </Link>
            . {PROGRAMS.length} programs, one model line.
          </p>
        </div>
      </section>
    </main>
  );
}
