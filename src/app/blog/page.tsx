import Link from 'next/link';
import { sortedPosts } from '@/lib/posts';

export const metadata = { title: 'Notes' };

export default function BlogIndex() {
  const posts = sortedPosts();
  return (
    <main className="sheet">
      <section className="row pt-10 pb-0">
        <div className="hang">Notes</div>
        <div>
          <h1 className="page-title">Notes</h1>
          <p className="lede mt-5 mb-0 max-w-[34rem]">
            Papers, and the method around them. Written when there is something to record, not on a schedule.
          </p>
        </div>
      </section>

      {posts.map((p) => (
        <section key={p.slug} className="row mt-8">
          <div className="hang">{p.displayDate}<br />{p.kind.toLowerCase()}</div>
          <article>
            <Link href={`/blog/${p.slug}`} className="entry-title">{p.title}</Link>
            <p className="muted mt-2 mb-0 max-w-[38rem]">{p.summary}</p>
          </article>
        </section>
      ))}
    </main>
  );
}
