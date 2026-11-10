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
  if (!post) return { title: 'Not found' };
  return { title: post.title, description: post.summary };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-page px-6 md:px-10">
      <div className="border-b border-rule py-4">
        <Link href="/blog" className="mono-label link">
          ← Notes
        </Link>
      </div>

      <article className="mx-auto max-w-measure py-14">
        <p className="mono-label">
          {post.kind} <span className="px-2 text-rule">/</span> {post.displayDate}{' '}
          <span className="px-2 text-rule">/</span> {post.readingTime}
        </p>

        <h1 className="mt-6 font-serif text-[clamp(32px,4.6vw,44px)] font-normal leading-[1.1] tracking-[-0.02em]">
          {post.title}
        </h1>

        <p className="mt-5 font-serif text-[16px] text-ink">{post.authors}</p>

        <p className="mono-label mt-5">{post.tags.join(' / ')}</p>

        {post.links.length > 0 && (
          <p className="mt-7 flex flex-wrap gap-x-7 gap-y-2 border-t border-rule pt-4">
            {post.links.slice(0, 2).map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noreferrer' : undefined}
                className="mono-label link"
              >
                {l.label} {l.external ? '↗' : '→'}
              </a>
            ))}
          </p>
        )}

        <div className="mt-10 border-t border-ink pt-8">{post.body}</div>

        {post.links.length > 0 && (
          <section className="mt-14 border-t border-rule pt-6">
            <p className="mono-label">Source</p>
            <ul className="mt-3 space-y-2">
              {post.links.map((l) => (
                <li key={l.href} className="font-serif text-[16px]">
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noreferrer" className="link">
                      {l.label} ↗
                    </a>
                  ) : (
                    <Link href={l.href} className="link">
                      {l.label} →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-12 border-t border-rule pt-6 font-serif text-[14px] leading-relaxed text-muted">
          {post.kind === 'PAPER'
            ? 'Unpublished manuscript. Not peer reviewed; no priority claim is made.'
            : 'Lab note. Describes the conditions a result was produced under, not a new claim.'}
        </p>
      </article>
    </main>
  );
}
