import Link from 'next/link';
import { PUBLICATIONS } from '@/lib/lab';
import CopyCitation from '@/components/copy-citation';

export const metadata = { title: 'Publications' };

const BIBTEX = `@misc{imran2026changingoneword,
  title  = {Changing One Word: a paired test of anchor direction in list indexing},
  author = {Imran, Muhammad Ammar},
  year   = {2026},
  note   = {Preprint, v6. Not peer reviewed.},
  url    = {https://github.com/okyssta/llm-midpoint-anchor-study}
}`;

export default function PublicationsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <p className="mono-label pt-20">RECORD</p>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">PUBLICATIONS</h1>
      <p className="mt-8 max-w-xl text-sm leading-relaxed text-[#8c9197]">
        Every entry ships with the raw records and the analysis code that produced its numbers.
        Preprints are labelled as preprints.
      </p>

      <div className="mt-16">
        {PUBLICATIONS.map((pub) => (
          <article key={pub.slug} className="record border-t hairline py-14 last:border-b">
            <div className="grid gap-10 md:grid-cols-[3rem_1fr]">
              <span className="font-mono text-xs text-[#3d434b]">01</span>
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-[#555b61]">
                  <span className="border border-[#161a1e] px-2 py-1">{pub.version}</span>
                  <span>{pub.displayDate}</span>
                  <span>{pub.venue}</span>
                </div>

                <h2 className="mt-6 max-w-3xl text-2xl font-medium leading-tight tracking-tight text-[#f5f5f2] md:text-3xl">
                  <Link href={`/blog/${pub.slug}`} className="transition-colors hover:text-[#c9cdd2]">
                    {pub.title}
                  </Link>
                </h2>
                <p className="mt-3 font-mono text-xs text-[#555b61]">{pub.authors}</p>

                <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#8c9197]">{pub.abstract}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <CopyCitation bibtex={BIBTEX} />
                  {pub.links.map((l) =>
                    l.external ? (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost !rounded-lg"
                      >
                        {l.label} ↗
                      </a>
                    ) : (
                      <Link key={l.href} href={l.href} className="btn btn-primary !rounded-lg">
                        {l.label} →
                      </Link>
                    ),
                  )}
                </div>

                <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-2 border-t hairline pt-6 font-mono text-[11px] md:grid-cols-4">
                  <div>
                    <dt className="text-[#555b61]">TYPE</dt>
                    <dd className="mt-1 text-[#c9cdd2]">PREPRINT</dd>
                  </div>
                  <div>
                    <dt className="text-[#555b61]">REVIEW</dt>
                    <dd className="mt-1 text-[#c9cdd2]">NOT PEER REVIEWED</dd>
                  </div>
                  <div>
                    <dt className="text-[#555b61]">LICENCE</dt>
                    <dd className="mt-1 text-[#c9cdd2]">CC BY 4.0 · MIT CODE</dd>
                  </div>
                  <div>
                    <dt className="text-[#555b61]">PRIORITY</dt>
                    <dd className="mt-1 text-[#8c9197]">NO CLAIM</dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        ))}

        <div className="border-t hairline py-10">
          <p className="font-mono text-[11px] text-[#555b61]">
            In preparation — a hybrid-architecture ablation study (program 01). Not yet submitted.
          </p>
        </div>
      </div>
    </main>
  );
}
