import Link from 'next/link';
import { sortedPosts } from '@/lib/posts';

export const metadata = { title: 'Blog' };

export default function BlogIndex() {
  const posts = sortedPosts();
  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <p className="mono-label pt-20">NOTES FROM THE LAB</p>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">BLOG</h1>
      <p className="mt-8 max-w-xl text-sm leading-relaxed text-[#8c9197]">
        Papers, and the method notes around them. Written when there is something to record, not on a
        schedule.
      </p>

      <div className="mt-16">
        {posts.map((p) => (
          <article key={p.slug} className="record border-t hairline py-12 last:border-b">
            <div className="grid gap-6 md:grid-cols-[3rem_1fr_auto] md:items-baseline">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#3d434b]">
                {p.kind}
              </span>
              <div>
                <h2 className="text-2xl font-medium leading-tight tracking-tight text-[#f5f5f2]">
                  <Link href={`/blog/${p.slug}`} className="transition-colors hover:text-[#c9cdd2]">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8c9197]">{p.summary}</p>
                <p className="mt-4 font-mono text-[11px] text-[#555b61]">
                  {p.displayDate} · {p.authors} · {p.readingTime}
                </p>
              </div>
              <Link
                href={`/blog/${p.slug}`}
                className="justify-self-start font-mono text-[11px] uppercase tracking-widest text-[#8c9197] transition-colors hover:text-[#f5f5f2] md:justify-self-end"
              >
                Read →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
