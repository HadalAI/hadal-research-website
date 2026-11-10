import Link from 'next/link';
import DitherGlobe from '@/components/dither-globe';
import { MODELS, PROGRAMS, PUBLICATIONS } from '@/lib/lab';

const ICONS = {
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1z',
  ruler: 'M2 12h20M6 8v8M10 10v4M14 8v8M18 10v4',
  nodes: 'M12 3v6M12 15v6M3 12h6M15 12h6M8 8l8 8M16 8l-8 8',
};

function Icon({ d, className = 'text-[#555b61]' }: { d: string; className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const PROGRAM_ICON: Record<string, string> = {
  'hybrid-architectures': ICONS.layers,
  'long-context': ICONS.compass,
  measurement: ICONS.ruler,
  'retrieval-geometry': ICONS.nodes,
};

export default function HomePage() {
  const paper = PUBLICATIONS[0];
  const model = MODELS[0];

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-16 md:pt-24 lg:grid-cols-[1fr_520px]">
          <div>
            <p className="mono-label">INDEPENDENT RESEARCH LAB · EST. 2026</p>
            <h1 className="mt-7 text-[52px] font-semibold leading-[1.02] tracking-tight md:text-[68px]">
              Research,
              <br />
              <span className="text-[#7f858c]">at depth.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-[#9aa0a6]">
              Hadal Research is a small lab studying hybrid language models — how attention,
              recurrence and retrieval should be combined — and the measurement methods that decide
              whether a change is real.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/research" className="btn btn-primary !rounded-lg">
                Research agenda&nbsp;&nbsp;→
              </Link>
              <Link href="/blog/changing-one-word" className="btn btn-ghost !rounded-lg">
                Latest paper
              </Link>
            </div>
          </div>

          <figure className="relative mx-auto mt-2 w-full max-w-[330px] lg:mt-0 lg:max-w-none">
            <DitherGlobe size={520} />
            <figcaption className="mt-5 flex items-baseline justify-between gap-4 border-t hairline pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#555b61]">
              <span>FIG. 01 — LANDMASS</span>
              <span>ORDERED DITHER / BAYER 4×4</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* INDEX STRIP */}
      <section className="border-b hairline bg-[#07090b]/60">
        <div className="mx-auto grid max-w-6xl px-6 md:grid-cols-3 md:divide-x md:divide-[#161a1e]">
          {PROGRAMS.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              href={`/research#${p.slug}`}
              className="group flex items-center gap-3 py-4 md:px-5"
            >
              <span className="font-mono text-[10px] text-[#3d434b]">{p.id}</span>
              <Icon d={PROGRAM_ICON[p.slug]} />
              <span className="text-xs text-[#c9cdd2] transition-colors group-hover:text-[#f5f5f2]">
                {p.title}
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-[#555b61]">
                {p.status}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* AGENDA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-baseline justify-between">
          <p className="mono-label">CURRENT WORK</p>
          <Link
            href="/research"
            className="text-xs text-[#8c9197] transition-colors hover:text-[#f5f5f2]"
          >
            Full agenda →
          </Link>
        </div>

        <div className="mt-10">
          {PROGRAMS.map((p) => (
            <Link
              key={p.slug}
              href={`/research#${p.slug}`}
              className="record grid gap-4 border-t hairline py-8 last:border-b md:grid-cols-[3rem_1fr_auto] md:items-baseline"
            >
              <span className="font-mono text-xs text-[#3d434b]">{p.id}</span>
              <div>
                <h2 className="text-xl font-medium tracking-tight text-[#f5f5f2]">{p.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8c9197]">{p.lead}</p>
              </div>
              <span
                className={`justify-self-start whitespace-nowrap font-mono text-[10px] uppercase tracking-widest md:justify-self-end ${
                  p.status === 'PUBLISHED' ? 'text-[#5b8fa8]' : p.status === 'ACTIVE' ? 'text-emerald-500' : 'text-[#555b61]'
                }`}
              >
                {p.status}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST PUBLICATION */}
      <section className="border-y hairline bg-[#07090b]/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mono-label">LATEST PUBLICATION</p>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-[#555b61]">
                <span className="border border-[#161a1e] px-2 py-1">{paper.version}</span>
                <span>{paper.displayDate}</span>
                <span>{paper.venue}</span>
              </div>
              <h2 className="mt-6 max-w-2xl text-2xl font-medium leading-tight tracking-tight text-[#f5f5f2] md:text-3xl">
                <Link href={`/blog/${paper.slug}`} className="transition-colors hover:text-[#c9cdd2]">
                  {paper.title}
                </Link>
              </h2>
              <p className="mt-3 font-mono text-xs text-[#555b61]">{paper.authors}</p>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#8c9197]">{paper.abstract}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={`/blog/${paper.slug}`} className="btn btn-primary !rounded-lg">
                  Read the paper&nbsp;&nbsp;→
                </Link>
                {paper.links
                  .filter((l) => l.external && l.label.includes('PDF'))
                  .map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost !rounded-lg"
                    >
                      PDF ↗
                    </a>
                  ))}
                <a
                  href="https://github.com/okyssta/llm-midpoint-anchor-study"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost !rounded-lg"
                >
                  Code ↗
                </a>
              </div>
            </div>

            <aside className="border-l-0 lg:border-l hairline lg:pl-12">
              <p className="mono-label">HEADLINE RESULT</p>
              <p className="tabular mt-4 font-mono text-5xl tracking-tight text-[#f5f5f2]">−33.3</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-[#555b61]">
                pp · backward vs forward
              </p>
              <dl className="mt-8 space-y-3 border-t hairline pt-6 font-mono text-[11px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#555b61]">95% CI</dt>
                  <dd className="text-[#c9cdd2]">[−51.2, −11.6]</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#555b61]">EXACT P</dt>
                  <dd className="text-[#c9cdd2]">0.00781</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#555b61]">MARGIN</dt>
                  <dd className="text-[#8c9197]">not cleared</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#555b61]">MODEL</dt>
                  <dd className="text-[#c9cdd2]">QWEN2.5-1.5B</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* MODEL + COMPUTE */}
      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-2">
        <div>
          <p className="mono-label">MODEL PROGRAM</p>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-mono text-3xl tracking-tight text-[#f5f5f2]">{model.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#555b61]">
              {model.status}
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#8c9197]">{model.description}</p>
          <dl className="mt-8 border-t hairline pt-6 font-mono text-[11px]">
            {model.specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b hairline py-2.5 last:border-0">
                <dt className="text-[#555b61]">{k}</dt>
                <dd className="text-right text-[#c9cdd2]">{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/models"
            className="mt-6 inline-flex text-xs text-[#8c9197] transition-colors hover:text-[#f5f5f2]"
          >
            Model program →
          </Link>
        </div>

        <div>
          <p className="mono-label">METHOD</p>
          <h2 className="mt-6 max-w-sm text-xl font-medium leading-snug tracking-tight text-[#f5f5f2]">
            Small studies, fully rebuilt from their records.
          </h2>
          <ul className="mt-8 space-y-5 text-sm leading-relaxed text-[#8c9197]">
            <li>
              <span className="text-[#c9cdd2]">Decision rules before data.</span> Practical margins are
              fixed ahead of the run and stated separately from anything chosen afterwards.
            </li>
            <li>
              <span className="text-[#c9cdd2]">Paired by item.</span> One variable per contrast, so a
              difference can only come from the thing we changed.
            </li>
            <li>
              <span className="text-[#c9cdd2]">Negative results ship.</span> A cell with no effect is
              part of the result, not a footnote.
            </li>
            <li>
              <span className="text-[#c9cdd2]">No dependency to trust.</span> The analysis path runs on
              the Python standard library alone.
            </li>
          </ul>
          <Link
            href="/research#measurement"
            className="mt-8 inline-flex text-xs text-[#8c9197] transition-colors hover:text-[#f5f5f2]"
          >
            Read the method →
          </Link>
        </div>
      </section>

      {/* BLOG STRIP */}
      <section className="border-t hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10">
          <p className="mono-label">NOTES FROM THE LAB</p>
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-widest text-[#8c9197] transition-colors hover:text-[#f5f5f2]"
          >
            All posts →
          </Link>
        </div>
      </section>
    </main>
  );
}
