import Link from 'next/link';
import { sortedPosts } from '@/lib/posts';

export const metadata = { title: 'Notes' };

export default function BlogIndex() {
  const posts = sortedPosts();

  return (
    <main className="mx-auto max-w-page px-6 md:px-10">
      <header className="grid gap-10 border-b border-rule py-14 md:grid-cols-[1fr_260px] md:items-end">
        <div>
          <p className="mono-label">Section 03</p>
          <h1 className="mt-5 font-sans text-[clamp(40px,6vw,64px)] font-medium leading-[0.96] tracking-[-0.03em]">
            Notes
          </h1>
          <p className="mt-6 max-w-[52ch] font-serif text-[18px] leading-[1.55] text-muted">
            Papers, and the method around them. Written when there is something to record, not on
            a schedule.
          </p>
        </div>
        <dl className="border-t border-rule pt-4 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <div className="flex justify-between gap-4">
            <dt className="mono-label">Entries</dt>
            <dd className="tabular font-mono text-[11px]">{String(posts.length).padStart(2, '0')}</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="mono-label">Latest</dt>
            <dd className="font-mono text-[11px]">{posts[0]?.displayDate}</dd>
          </div>
        </dl>
      </header>

      {posts.map((p) => (
        <article key={p.slug} className="ink-row border-b border-rule py-10">
          <div className="grid gap-4 md:grid-cols-[8rem_1fr_auto] md:items-baseline">
            <div>
              <p className="mono-label">{p.kind}</p>
              <p className="mono-label mt-1">{p.displayDate}</p>
            </div>
            <div>
              <h2 className="max-w-[30ch] font-serif text-[26px] leading-[1.18] tracking-[-0.01em]">
                <Link href={`/blog/${p.slug}`} className="transition-colors hover:text-accent">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-[62ch] font-serif text-[16px] leading-relaxed text-muted">
                {p.summary}
              </p>
            </div>
            <Link href={`/blog/${p.slug}`} className="link font-serif text-[16px]">
              Read →
            </Link>
          </div>
        </article>
      ))}
    </main>
  );
}
