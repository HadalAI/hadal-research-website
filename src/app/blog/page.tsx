import Link from 'next/link';
import Doodle from '@/components/doodles';
import { Paper, SectionTitle, HandRule, DoodleRow } from '@/components/sketch';
import { sortedPosts } from '@/lib/posts';

export const metadata = { title: 'Notes' };

export default function BlogIndex() {
  const posts = sortedPosts();
  return (
    <main className="mx-auto max-w-page px-5 md:px-10">
      <header className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label flex items-center gap-2"><Doodle name="pencil" className="h-6 w-6 text-marker" /> section three</p>
            <h1 className="mt-3 font-marker text-[clamp(44px,7vw,72px)] leading-none">Notes</h1>
            <p className="mt-5 max-w-[56ch] text-[20px] leading-snug">
              Papers, and the method around them. Written when there is something to record, not on a schedule.
            </p>
          </div>
          <Paper variant={2} tilt="r">
            <p className="label">the stack</p>
            <p className="mt-1 font-marker text-[32px]">{String(posts.length).padStart(2, '0')} <span className="font-hand text-[19px]">entries</span></p>
            <p className="note">latest · {posts[0]?.displayDate}</p>
          </Paper>
        </div>
        <DoodleRow count={12} className="justify-start !pb-0" />
      </header>

      <HandRule />

      {posts.map((p, i) => (
        <section key={p.slug} className="mb-7">
          {i > 0 && <DoodleRow count={8} />}
          <Paper variant={(i % 4) as 0 | 1 | 2 | 3} tilt={i % 2 === 0 ? 'l' : 'r'}>
            <div className="flex flex-wrap items-center gap-3">
              <Doodle name={p.kind === 'PAPER' ? 'pencil' : 'note'} className="h-6 w-6 text-marker" />
              <span className="note uppercase">{p.kind}</span>
              <span className="note text-pencil">{p.displayDate}</span>
            </div>
            <h2 className="mt-2 max-w-[38ch] font-marker text-[27px] leading-tight">
              <Link href={`/blog/${p.slug}`} className="hover:text-marker">{p.title}</Link>
            </h2>
            <p className="mt-2 max-w-[64ch] text-[18px] leading-snug">{p.summary}</p>
            <p className="mt-3 flex items-center gap-2">
              <Doodle name="arrow" className="h-5 w-5 text-marker" />
              <Link href={`/blog/${p.slug}`} className="link text-[18px]">read</Link>
            </p>
          </Paper>
        </section>
      ))}
    </main>
  );
}
