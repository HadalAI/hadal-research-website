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
    <main className="mx-auto max-w-page px-6 md:px-10">
      <header className="grid gap-10 border-b border-rule py-14 md:grid-cols-[1fr_260px] md:items-end">
        <div>
          <p className="mono-label">Section 02</p>
          <h1 className="mt-5 font-sans text-[clamp(40px,6vw,64px)] font-medium leading-[0.96] tracking-[-0.03em]">
            Publications
          </h1>
          <p className="mt-6 max-w-[52ch] font-serif text-[18px] leading-[1.55] text-muted">
            Every entry carries its records and the analysis code that produced its numbers.
            Preprints are labelled as preprints.
          </p>
        </div>
        <dl className="border-t border-rule pt-4 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <div className="flex justify-between gap-4">
            <dt className="mono-label">Papers</dt>
            <dd className="tabular font-mono text-[11px]">01</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="mono-label">Peer reviewed</dt>
            <dd className="tabular font-mono text-[11px]">00</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="mono-label">In preparation</dt>
            <dd className="tabular font-mono text-[11px]">01</dd>
          </div>
        </dl>
      </header>

      {PUBLICATIONS.map((pub) => (
        <article key={pub.slug} className="border-b border-rule py-12">
          <div className="grid gap-8 md:grid-cols-[5rem_1fr]">
            <div>
              <p className="mono-label tabular">01</p>
              <p className="mono-label mt-2">{pub.version}</p>
            </div>

            <div className="max-w-[68ch]">
              <p className="mono-label">
                {pub.displayDate} <span className="px-2 text-rule">/</span> {pub.venue}
              </p>
              <h2 className="mt-4 font-serif text-[30px] leading-[1.14] tracking-[-0.01em] md:text-[34px]">
                <Link href={`/blog/${pub.slug}`} className="transition-colors hover:text-accent">
                  {pub.title}
                </Link>
              </h2>
              <p className="mt-3 font-serif text-[15px] text-muted">{pub.authors}</p>

              <p className="mt-6 font-serif text-[17px] leading-[1.62] text-ink/85">{pub.abstract}</p>

              <p className="mt-7 flex flex-wrap gap-x-8 gap-y-3 font-serif text-[16px]">
                <Link href={`/blog/${pub.slug}`} className="link">
                  Read the paper →
                </Link>
                <a
                  href="https://github.com/okyssta/llm-midpoint-anchor-study/blob/main/paper/anchor_word_v6.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  PDF ↗
                </a>
                <a
                  href="https://github.com/okyssta/llm-midpoint-anchor-study"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  Code & records ↗
                </a>
                <CopyCitation bibtex={BIBTEX} />
              </p>

              <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-rule pt-5 md:grid-cols-4">
                {[
                  ['Type', 'Preprint'],
                  ['Review', 'Not peer reviewed'],
                  ['Licence', 'CC BY 4.0 · MIT code'],
                  ['Priority', 'No claim'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="mono-label">{k}</dt>
                    <dd className="mt-1 font-serif text-[14px] text-muted">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </article>
      ))}

      <p className="py-10 font-serif text-[15px] text-muted">
        In preparation — a hybrid-architecture ablation study (program 01). Not yet submitted.
      </p>
    </main>
  );
}
