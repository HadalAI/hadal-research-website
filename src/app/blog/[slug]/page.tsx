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
    <main className="sheet">
      <section className="row pt-12">
        <div className="hang">{post.kind}<br />{post.displayDate}<br />{post.readingTime}</div>
        <div>
          <p className="meta m-0 mb-4"><Link href="/blog">← Notes</Link></p>
          <h1 className="page-title max-w-[36rem]">{post.title}</h1>
          <p className="meta mt-5 mb-1">{post.authors}</p>
          <p className="kicker m-0">{post.tags.join(' · ')}</p>
          {post.links.length > 0 && (
            <p className="meta mt-5 mb-0 flex flex-wrap gap-x-5 gap-y-2">
              {post.links.slice(0, 2).map((l) => (
                <a key={l.href} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined}>
                  {l.label}
                </a>
              ))}
            </p>
          )}
        </div>
      </section>

      <section className="row mt-8">
        <div className="hang" />
        <article className="prose marginalia max-w-[40rem]">{post.body}</article>
      </section>

      {post.links.length > 0 && (
        <section className="row mt-9">
          <div className="hang">Sources</div>
          <ul className="muted mb-0 pl-4">
            {post.links.map((l) => (
              <li key={l.href} className="mb-2">
                {l.external ? <a href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
                            : <Link href={l.href}>{l.label}</Link>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="row mt-8">
        <div className="hang">Status</div>
        <p className="meta m-0 max-w-[36rem]">
          {post.kind === 'PAPER'
            ? 'Unpublished manuscript. Not peer reviewed; no priority claim is made.'
            : 'Lab note. Describes the conditions a result was produced under, not a new claim.'}
        </p>
      </section>
    </main>
  );
}
