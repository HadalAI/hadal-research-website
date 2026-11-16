import Link from 'next/link';
import CopyCitation from '@/components/copy-citation';
import Doodle from '@/components/doodles';
import { Paper, SectionTitle, HandRule, DoodleRow, Circled } from '@/components/sketch';
import { PUBLICATIONS } from '@/lib/lab';

export const metadata = { title: 'Publications' };

export default function PublicationsPage() {
  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label flex items-center gap-2">
              <Doodle name="book" className="h-6 w-6 text-marker" /> section two
            </p>
            <h1 className="mt-3 font-marker text-[clamp(44px,7vw,72px)] leading-none">Publications</h1>
            <p className="mt-5 max-w-[56ch] text-[20px] leading-snug">
              Every entry carries its records and the analysis code that produced its numbers.
              Preprints are labelled as preprints.
            </p>
          </div>
          <Paper variant={2} tilt="r">
            <p className="label">the tally</p>
            <p className="mt-1 flex items-center gap-3 text-[19px]">
              <Circled className="font-marker text-[32px]">{String(PUBLICATIONS.length).padStart(2, '0')}</Circled> papers
            </p>
            <p className="mt-1 flex items-center gap-3 text-[19px]">
              <Circled className="font-marker text-[32px] text-pencil">00</Circled> peer reviewed
            </p>
          </Paper>
        </div>
        <DoodleRow count={12} className="justify-start !pb-0" />
      </header>

      <HandRule />

      {PUBLICATIONS.map((pub, i) => (
        <section key={pub.slug} className="mb-10">
          {i > 0 && <DoodleRow count={9} />}
          <Paper variant={(i + 1) as 1 | 2} tilt={i % 2 === 0 ? 'r' : 'l'}>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-marker text-[34px] text-marker">{String(i + 1).padStart(2, '0')}</span>
              <p className="note">{pub.displayDate} · {pub.venue}</p>
              <span className="ml-auto"><Circled className="note text-[18px] font-semibold uppercase text-marker">{pub.version}</Circled></span>
            </div>

            <h2 className="mt-4 max-w-[34ch] font-marker text-[30px] leading-tight md:text-[35px]">
              <Link href={`/blog/${pub.slug}`} className="hover:text-marker">{pub.title}</Link>
            </h2>
            <p className="mt-2 flex items-center gap-2 text-[18px]">
              <Doodle name="pencil" className="h-4 w-4 text-marker" /> {pub.authors}
            </p>
            <p className="mt-4 max-w-[68ch] text-[18px] leading-snug">{pub.abstract}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              {pub.links.map((l) => l.external ? (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="btn">
                  {l.label}<Doodle name="plane" className="h-4 w-4" />
                </a>
              ) : (
                <Link key={l.label} href={l.href} className="btn">
                  {l.label}<Doodle name="arrow" className="h-4 w-4" />
                </Link>
              ))}
              <CopyCitation bibtex={pub.bibtex} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-4">
              {[
                ['type', 'preprint'], ['review', 'not peer reviewed'],
                ['licence', 'CC BY 4.0 · MIT code'], ['priority', 'no claim'],
              ].map(([k, v]) => (
                <p key={k} className="border-b border-dashed border-ink/25 pb-1">
                  <span className="note block">{k}</span>
                  <span className="text-[17px]">{v}</span>
                </p>
              ))}
            </div>
          </Paper>
        </section>
      ))}
    </main>
  );
}
