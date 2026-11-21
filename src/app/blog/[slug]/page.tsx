import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { POSTS, postBySlug } from '@/lib/posts';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }

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
    <main className="shell pb-4">
      <p className="meta pt-10 mb-8"><Link href="/blog">← Notes</Link></p>

      <article>
        <p className="entry-meta">{post.kind} · {post.displayDate} · {post.readingTime}</p>
        <h1 className="m-0 text-[clamp(1.7rem,3.6vw,2.15rem)] leading-[1.22]">{post.title}</h1>
        <p className="meta mt-4 mb-2">{post.authors}</p>
        <p className="label mb-8">{post.tags.join(' · ')}</p>

        {post.links.length > 0 && (
          <p className="meta mb-10 flex flex-wrap gap-x-5 gap-y-2">
            {post.links.slice(0, 2).map((l) => (
              <a key={l.href} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined}>
                {l.label}
              </a>
            ))}
          </p>
        )}

        <div className="prose marginalia">{post.body}</div>

        {post.links.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">Sources</h2>
            <ul className="muted mb-0 pl-5">
              {post.links.map((l) => (
                <li key={l.href} className="mb-2">
                  {l.external
                    ? <a href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
                    : <Link href={l.href}>{l.label}</Link>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="meta mt-12 mb-0">
          {post.kind === 'PAPER'
            ? 'Unpublished manuscript. Not peer reviewed; no priority claim is made.'
            : 'Lab note. Describes the conditions a result was produced under, not a new claim.'}
        </p>
      </article>
    </main>
  );
}
