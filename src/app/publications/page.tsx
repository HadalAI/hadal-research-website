import Link from 'next/link';
import { PUBLICATIONS } from '@/lib/lab';
import CopyCitation from '@/components/copy-citation';

export const metadata = { title: 'Publications' };

export default function PublicationsPage() {
  return (
    <main className="sheet">
      <section className="row pt-10 pb-0">
        <div className="hang">Papers</div>
        <div>
          <h1 className="page-title">Publications</h1>
          <p className="lede mt-5 mb-0 max-w-[34rem]">
            Every entry carries its records and the analysis code that produced its numbers.
            Preprints are labelled as preprints.
          </p>
        </div>
      </section>

      {PUBLICATIONS.map((pub) => (
        <section key={pub.slug} className="row mt-9">
          <div className="hang">{pub.displayDate}<br />{pub.version}</div>
          <article>
            <h2 className="section-title max-w-[30rem]">
              <Link href={`/blog/${pub.slug}`} className="entry-title">{pub.title}</Link>
            </h2>
            <p className="meta m-0">{pub.authors} · {pub.venue}</p>
            <p className="muted mt-4">{pub.abstract}</p>
            <p className="meta m-0 flex flex-wrap gap-x-5 gap-y-2">
              {pub.links.map((l) => l.external ? (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
              ) : (
                <Link key={l.label} href={l.href}>{l.label}</Link>
              ))}
              <CopyCitation bibtex={pub.bibtex} />
            </p>
          </article>
        </section>
      ))}
    </main>
  );
}
