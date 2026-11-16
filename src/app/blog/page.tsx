import Link from 'next/link';
import { sortedPosts } from '@/lib/posts';
import { Rule as SketchRule } from '@/components/sketch';
import { Doodle } from '@/components/doodles';

export const metadata = { title: 'Notes' };

export default function BlogIndex() {
  const posts = sortedPosts();

  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="grid gap-8 pb-8 pt-10 md:grid-cols-[1fr_auto] md:items-end md:pt-14">
        <div>
          <p className="label flex items-center gap-2 text-pencil">
            <span className="ring text-[15px] text-marker">03</span>
            section three
          </p>
          <h1 className="mt-4 font-marker text-[clamp(42px,7vw,70px)] leading-[0.95]">Notes</h1>
          <p className="mt-5 max-w-[56ch] text-[20px] leading-snug text-pencil">
            Papers, and the method around them. Written when there is something to record, not on a
            schedule.
          </p>
        </div>

        <div className="sticky w-fit rotate-[-1.1deg] px-5 pb-4 pt-3">
          <p className="label text-[14px] text-ink/70">the stack</p>
          <p className="mt-1 flex items-baseline gap-2 text-[19px]">
            <span className="tabular font-marker text-[34px] leading-none">
              {String(posts.length).padStart(2, '0')}
            </span>
            <span className="text-pencil">entries</span>
          </p>
          <p className="text-[16px] text-pencil">latest · {posts[0]?.displayDate}</p>
        </div>
      </header>

      <SketchRule className="text-ink" />

      <ul>
        {posts.map((p) => (
          <li key={p.slug}>
            <article className="ink-row group grid gap-3 py-8 md:grid-cols-[7.5rem_1fr_auto] md:items-baseline md:gap-6">
              <div className="flex items-center gap-2 md:block">
                <span className="inline-flex items-center gap-1.5">
                  <Doodle
                    name={p.kind === 'PAPER' ? 'pencil' : 'note'}
                    className="h-4 w-4 text-marker"
                    strokeWidth={3}
                  />
                  <span className="label text-[14px]">{p.kind}</span>
                </span>
                <p className="label mt-1 text-[14px] text-pencil md:block">{p.displayDate}</p>
              </div>

              <div>
                <h2 className="max-w-[34ch] text-[26px] leading-[1.16]">
                  <Link href={`/blog/${p.slug}`} className="group-hover:text-marker">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-2 max-w-[64ch] text-[18px] leading-snug text-pencil">
                  {p.summary}
                </p>
              </div>

              <Link href={`/blog/${p.slug}`} className="btn self-start text-[16px]">
                read
                <Doodle name="arrow" className="h-4 w-4" strokeWidth={3} />
              </Link>
            </article>
            <SketchRule className="text-ink/30" />
          </li>
        ))}
      </ul>
    </main>
  );
}
