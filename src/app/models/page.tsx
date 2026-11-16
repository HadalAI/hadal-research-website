import Link from 'next/link';
import Doodle from '@/components/doodles';
import { Paper, SectionTitle, HandRule, DoodleRow, Circled } from '@/components/sketch';
import { MODELS, PROGRAMS } from '@/lib/lab';

export const metadata = { title: 'Models' };

export default function ModelsPage() {
  const model = MODELS[0];
  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label flex items-center gap-2"><Doodle name="bulb" className="h-6 w-6 text-marker" /> section four</p>
            <h1 className="mt-3 font-marker text-[clamp(44px,7vw,72px)] leading-none">Models</h1>
            <p className="mt-5 max-w-[56ch] text-[20px] leading-snug">
              The lab builds its own models so architecture questions can be asked at a scale we control.
              Nothing is published until it can be evaluated against the probes in the agenda.
            </p>
          </div>
          <Paper variant={3} tilt="l">
            <p className="label">in the water</p>
            <p className="mt-1 flex items-center gap-3 text-[19px]"><Circled className="font-marker text-[32px] text-pencil">00</Circled> released</p>
            <p className="mt-1 flex items-center gap-3 text-[19px]"><Circled className="font-marker text-[32px]">01</Circled> in design</p>
          </Paper>
        </div>
        <DoodleRow count={12} className="justify-start !pb-0" />
      </header>

      <HandRule />

      <Paper variant={0} tilt="r">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-marker text-[34px] text-marker">01</span>
          <h2 className="font-marker text-[36px] leading-none">{model.name}</h2>
          <span className="ml-auto"><Circled className="note text-[18px] font-semibold uppercase text-marker">{model.status}</Circled></span>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <Doodle name="flask" className="mt-1 h-7 w-7 shrink-0 text-marker" />
          <p className="max-w-[62ch] text-[19px] leading-snug">{model.description}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 lg:grid-cols-4">
          {model.specs.map(([k, v]) => (
            <p key={k} className="border-b border-dashed border-ink/25 pb-1">
              <span className="note block">{k}</span><span className="text-[17px] leading-tight">{v}</span>
            </p>
          ))}
        </div>
        {model.notes && (
          <p className="scrawl mt-5 flex items-center gap-2 text-[20px]">
            <Doodle name="pin" className="h-5 w-5" /> {model.notes}
          </p>
        )}
      </Paper>

      <HandRule />

      <section className="mx-auto max-w-[64ch] pb-12">
        <SectionTitle icon="wave">Why hybrid</SectionTitle>
        <div className="mt-5 space-y-4 text-[19px] leading-snug">
          <p>Attention is the expensive part of a transformer, and not every block needs it. The question this lab is built around is which parts do — and whether a hybrid stack can keep the retrieval behaviour of attention while paying recurrent cost for the rest.</p>
          <p>HADAL-1 is the vehicle for that question, not a product. Its evaluation set comes from the <Link href="/research#long-context" className="link">long-context programme</Link>. {PROGRAMS.length} programmes, one model line.</p>
        </div>
      </section>
    </main>
  );
}
