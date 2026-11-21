import Link from 'next/link';
import { PUBLICATIONS } from '@/lib/lab';
import CopyCitation from '@/components/copy-citation';

export const metadata = { title: 'Publications' };

export default function PublicationsPage() {
  return (
    <main className="shell pb-4">
      <header className="pt-14 pb-10">
        <h1 className="display page-title m-0">Publications</h1>
        <p className="lede mt-6 mb-0">
          Every entry carries its records and the analysis code that produced its numbers.
          Preprints are labelled as preprints.
        </p>
      </header>

      <div className="stack">
        {PUBLICATIONS.map((pub) => (
          <article key={pub.slug}>
            <p className="entry-meta">{pub.displayDate} · {pub.version} · {pub.venue}</p>
            <h2 className="m-0 text-[1.3rem] leading-snug">
              <Link href={`/blog/${pub.slug}`} className="entry-title">{pub.title}</Link>
            </h2>
            <p className="meta mt-2 mb-4">{pub.authors}</p>
            <p className="muted">{pub.abstract}</p>
            <p className="meta mb-0 flex flex-wrap gap-x-5 gap-y-2">
              {pub.links.map((l) => l.external ? (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
              ) : (
                <Link key={l.label} href={l.href}>{l.label}</Link>
              ))}
              <CopyCitation bibtex={pub.bibtex} />
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
