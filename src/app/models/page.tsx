import Link from 'next/link';

export const metadata = {
  title: 'Models',
  description: 'Open models released by Hadal Research, with the measurements behind each one.',
};

/** One entry per released model. Each links to its own dedicated page. */
const RELEASED = [
  {
    slug: 'qori-1',
    name: 'Qori 1',
    params: '1.7B',
    line: 'A small open model that writes file edits a harness can apply byte-for-byte.',
    date: 'November 2026',
    measured: '90.0% of held-out commits applied exactly, against 31.7% for a 1.8× larger model.',
    repo: 'kyssta/Qori-1',
    doc: { label: 'paper', file: 'PAPER.md' },
  },
  {
    slug: 'qori-ocr',
    name: 'Qori-OCR',
    params: '3.13M',
    line: 'A CTC word recogniser for English crops: 4.05 MB as int8, 11.4 ms per crop on one x86 core.',
    date: 'November 2026',
    measured:
      '69.9% cleansed word accuracy on 5,722 held-out crops — 8.3 points behind a 1.11M model, published with that result.',
    repo: 'kyssta/Qori-OCR',
    doc: { label: 'benchmark report', file: 'BENCHMARK_REPORT.pdf' },
  },
];

export default function ModelsPage() {
  return (
    <main className="sheet">
      <section className="row pt-10 pb-0">
        <div className="hang">§ Models</div>
        <div>
          <h1 className="page-title">Models</h1>
          <p className="lede mt-5 mb-0 max-w-[34rem]">
            Open weights, released with the evaluation code, the raw per-item results and the
            measurements we would want to see if someone else had trained them.
          </p>
        </div>
      </section>

      {RELEASED.map((m) => (
        <section key={m.slug} className="row mt-9">
          <div className="hang">
            {m.date}
            <br />
            {m.params}
          </div>
          <article>
            <h2 className="section-title max-w-[30rem]">
              <Link href={`/models/${m.slug}`} className="entry-title">
                {m.name}
              </Link>
            </h2>
            <p className="muted mt-4 max-w-[34rem]">{m.line}</p>
            <p className="meta m-0">{m.measured}</p>
            <p className="meta mt-4 m-0 flex flex-wrap gap-x-5 gap-y-2">
              <Link href={`/models/${m.slug}`}>model page</Link>
              <a href={`https://huggingface.co/${m.repo}`} target="_blank" rel="noreferrer">
                weights
              </a>
              <a
                href={`https://huggingface.co/${m.repo}/blob/main/${m.doc.file}`}
                target="_blank"
                rel="noreferrer"
              >
                {m.doc.label}
              </a>
            </p>
          </article>
        </section>
      ))}
    </main>
  );
}
