import Link from 'next/link';
import { MODELS, PROGRAMS } from '@/lib/lab';
import { Frame, Stamp, Rule as SketchRule } from '@/components/sketch';
import { Doodle } from '@/components/doodles';

export const metadata = { title: 'Models' };

export default function ModelsPage() {
  const model = MODELS[0];

  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="grid gap-8 pb-8 pt-10 md:grid-cols-[1fr_auto] md:items-end md:pt-14">
        <div>
          <p className="label flex items-center gap-2 text-pencil">
            <span className="ring text-[15px] text-marker">04</span>
            section four
          </p>
          <h1 className="mt-4 font-marker text-[clamp(42px,7vw,70px)] leading-[0.95]">Models</h1>
          <p className="mt-5 max-w-[56ch] text-[20px] leading-snug text-pencil">
            The lab builds its own models so architecture questions can be asked at a scale we
            control. Nothing is published until it can be evaluated against the probes in the
            agenda.
          </p>
        </div>

        <div className="sticky w-fit rotate-[1deg] px-5 pb-4 pt-3">
          <p className="label text-[14px] text-ink/70">in the water</p>
          <p className="mt-1 flex items-baseline gap-2 text-[19px]">
            <span className="tabular font-marker text-[34px] leading-none text-pencil">00</span>
            <span className="text-pencil">released</span>
          </p>
          <p className="flex items-baseline gap-2 text-[19px]">
            <span className="tabular font-marker text-[34px] leading-none">01</span>
            <span className="text-pencil">in design</span>
          </p>
        </div>
      </header>

      <SketchRule className="text-ink" />

      <article className="py-10">
        <Frame fill tape tilt="l" className="px-6 pb-8 pt-7 md:px-9">
          <div className="flex flex-wrap items-center gap-3">
            <span className="ring text-marker">01</span>
            <h2 className="font-marker text-[34px] leading-none">{model.name}</h2>
            <span className="ml-auto">
              <Stamp color="var(--pencil)">{model.status}</Stamp>
            </span>
          </div>

          <p className="mt-5 max-w-[62ch] text-[19px] leading-[1.5] text-pencil">
            {model.description}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-4 lg:grid-cols-4">
            {model.specs.map(([k, v]) => (
              <div key={k} className="border-t-2 border-ink/80 pt-2">
                <dt className="label text-[13px] text-pencil">{k}</dt>
                <dd className="mt-0.5 text-[16px] leading-tight">{v}</dd>
              </div>
            ))}
          </dl>

          {model.notes && (
            <div className="sticky mt-7 w-fit max-w-[46ch] rotate-[-0.8deg] px-4 py-3">
              <p className="flex items-start gap-2 text-[17px] leading-snug">
                <Doodle name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-marker" strokeWidth={3} />
                {model.notes}
              </p>
            </div>
          )}
        </Frame>
      </article>

      <section className="mx-auto max-w-[64ch] pb-14">
        <p className="label flex items-center gap-2 text-pencil">
          <Doodle name="wave" className="h-4 w-4 text-marker" strokeWidth={3} />
          why hybrid
        </p>
        <div className="mt-3 space-y-4 text-[19px] leading-[1.5] text-pencil">
          <p>
            Attention is the expensive part of a transformer, and not every block needs it. The
            question this lab is built around is which parts do — and whether a hybrid stack can
            keep the retrieval behaviour of attention while paying recurrent cost for the rest.
          </p>
          <p>
            HADAL-1 is the vehicle for that question, not a product. Its evaluation set comes from
            the{' '}
            <Link href="/research#long-context" className="link">
              long-context programme
            </Link>
            . {PROGRAMS.length} programmes, one model line.
          </p>
          <p className="text-[17px]">
            When a model ships it will be listed here with its card, its evaluation record and the
            configuration that produced it.
          </p>
        </div>
      </section>
    </main>
  );
}
