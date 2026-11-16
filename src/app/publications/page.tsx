import Link from 'next/link';
import { PUBLICATIONS } from '@/lib/lab';
import CopyCitation from '@/components/copy-citation';
import { Frame, Stamp, Rule as SketchRule } from '@/components/sketch';
import { Doodle } from '@/components/doodles';

export const metadata = { title: 'Publications' };

export default function PublicationsPage() {
  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="grid gap-8 pb-8 pt-10 md:grid-cols-[1fr_auto] md:items-end md:pt-14">
        <div>
          <p className="label flex items-center gap-2 text-pencil">
            <span className="ring text-[15px] text-marker">02</span>
            section two
          </p>
          <h1 className="mt-4 font-marker text-[clamp(42px,7vw,70px)] leading-[0.95]">
            Publications
          </h1>
          <p className="mt-5 max-w-[56ch] text-[20px] leading-snug text-pencil">
            Every entry carries its records and the analysis code that produced its numbers.
            Preprints are labelled as preprints.
          </p>
        </div>

        <div className="sticky w-fit rotate-[-1deg] px-5 pb-4 pt-3">
          <p className="label text-[14px] text-ink/70">the tally</p>
          <p className="mt-1 flex items-baseline gap-2 text-[19px]">
            <span className="tabular font-marker text-[34px] leading-none">
              {String(PUBLICATIONS.length).padStart(2, '0')}
            </span>
            <span className="text-pencil">papers</span>
          </p>
          <p className="flex items-baseline gap-2 text-[19px]">
            <span className="tabular font-marker text-[34px] leading-none text-pencil">00</span>
            <span className="text-pencil">peer reviewed</span>
          </p>
        </div>
      </header>

      <SketchRule className="text-ink" />

      {PUBLICATIONS.map((pub, i) => (
        <article key={pub.slug} className="py-10">
          <Frame
            fill
            tape={i === 0}
            tilt={i % 2 === 0 ? 'r' : 'l'}
            className="px-6 pb-8 pt-7 md:px-9"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="ring text-marker">{String(i + 1).padStart(2, '0')}</span>
              <p className="label text-pencil">
                {pub.displayDate} · {pub.venue}
              </p>
              <span className="ml-auto">
                <Stamp>{pub.version}</Stamp>
              </span>
            </div>

            <h2 className="mt-4 max-w-[34ch] text-[28px] leading-[1.14] md:text-[33px]">
              <Link href={`/blog/${pub.slug}`} className="hover:text-marker">
                {pub.title}
              </Link>
            </h2>
            <p className="mt-2 flex items-center gap-2 text-[18px] text-pencil">
              <Doodle name="pencil" className="h-4 w-4" strokeWidth={3} />
              {pub.authors}
            </p>

            <p className="mt-5 max-w-[68ch] text-[18px] leading-[1.55] text-ink/85">
              {pub.abstract}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {pub.links.map((l) =>
                l.external ? (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    {l.label}
                    <Doodle name="plane" className="h-4 w-4" strokeWidth={3} />
                  </a>
                ) : (
                  <Link key={l.label} href={l.href} className="btn">
                    {l.label}
                    <Doodle name="arrow" className="h-4 w-4" strokeWidth={3} />
                  </Link>
                ),
              )}
              <CopyCitation bibtex={pub.bibtex} />
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-4">
              {[
                ['type', 'preprint'],
                ['review', 'not peer reviewed'],
                ['licence', 'CC BY 4.0 · MIT code'],
                ['priority', 'no claim'],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-dashed border-ink/30 pt-2">
                  <dt className="label text-[13px] text-pencil">{k}</dt>
                  <dd className="text-[16px]">{v}</dd>
                </div>
              ))}
            </dl>
          </Frame>
        </article>
      ))}
    </main>
  );
}
