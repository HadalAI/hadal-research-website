import Link from 'next/link';
import { sortedPosts } from '@/lib/posts';

export const metadata = { title: 'Notes' };

export default function BlogIndex() {
  const posts = sortedPosts();
  return (
    <main className="shell pb-4">
      <header className="pt-14 pb-10">
        <h1 className="display page-title m-0">Notes</h1>
        <p className="lede mt-6 mb-0">
          Papers, and the method around them. Written when there is something to record, not on a schedule.
        </p>
      </header>

      <div>
        {posts.map((p) => (
          <article key={p.slug} className="entry">
            <p className="entry-meta">{p.kind} · {p.displayDate} · {p.readingTime}</p>
            <Link href={`/blog/${p.slug}`} className="entry-title">{p.title}</Link>
            <p className="mt-2 mb-0 muted">{p.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
