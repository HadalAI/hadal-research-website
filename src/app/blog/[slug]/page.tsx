import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { POSTS, postBySlug } from '@/lib/posts';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: 'Post not found' };
  return { title: post.title, description: post.summary };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-32">
      <div className="pt-16">
        <Link
          href="/blog"
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#555b61] transition-colors hover:text-[#f5f5f2]"
        >
          ← Blog
        </Link>
      </div>

      <header className="mt-10 border-b hairline pb-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#555b61]">
          <span className="border border-[#161a1e] px-2 py-1 text-[#8c9197]">{post.kind}</span>
          <span>{post.displayDate}</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="mt-7 text-[34px] font-semibold leading-[1.15] tracking-tight text-[#f5f5f2] md:text-[42px]">
          {post.title}
        </h1>
        <p className="mt-5 font-mono text-xs text-[#8c9197]">{post.authors}</p>
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-[#555b61]">
          {post.tags.map((t) => (
            <li key={t} className="border border-[#161a1e] px-2 py-1">
              {t}
            </li>
          ))}
        </ul>
      </header>

      <article className="mt-10">{post.body}</article>

      {post.links.length > 0 && (
        <section className="mt-16 border-t hairline pt-8">
          <p className="mono-label mb-5">SOURCE</p>
          <ul className="space-y-3">
            {post.links.map((l) => (
              <li key={l.href}>
                {l.external ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-[#7aa7c0] underline-offset-4 hover:underline"
                  >
                    {l.label} ↗
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    className="font-mono text-xs text-[#7aa7c0] underline-offset-4 hover:underline"
                  >
                    {l.label} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-16 border-t hairline pt-8">
        <p className="text-[13px] leading-relaxed text-[#555b61]">
          {post.kind === 'PAPER'
            ? 'Unpublished manuscript. Not peer reviewed; no priority claim is made.'
            : 'Lab note. Describes the conditions a result was produced under, not a new claim.'}
        </p>
      </footer>
    </main>
  );
}
