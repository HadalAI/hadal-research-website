import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { POSTS, postBySlug } from '@/lib/posts';
import { Stamp, Rule as SketchRule } from '@/components/sketch';
import { Doodle } from '@/components/doodles';

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
    <main className="mx-auto max-w-page px-5 md:px-10">
      <div className="mx-auto max-w-measure py-4">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-[18px] text-pencil hover:text-marker">
          <Doodle name="arrow" className="h-4 w-4 -scale-x-100" strokeWidth={3} />
          all notes
        </Link>
      </div>

      <article className="mx-auto max-w-measure pb-16">
        <div className="flex flex-wrap items-center gap-3">
          <Stamp color={post.kind === 'PAPER' ? 'var(--marker)' : 'var(--pen)'}>{post.kind}</Stamp>
          <p className="label text-[16px] text-pencil">
            {post.displayDate} · {post.readingTime}
          </p>
        </div>

        <h1 className="mt-5 text-balance text-[clamp(32px,4.4vw,46px)] font-normal leading-[1.1]">
          {post.title}
        </h1>

        <p className="mt-4 flex items-center gap-2 text-[19px]">
          <Doodle name="pencil" className="h-4 w-4 text-marker" strokeWidth={3} />
          {post.authors}
        </p>

        <p className="label mt-4 text-[15px] text-pencil">{post.tags.join(' · ')}</p>

        {post.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {post.links.slice(0, 2).map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noreferrer' : undefined}
                className="btn text-[16px]"
              >
                {l.label}
                <Doodle name={l.external ? 'plane' : 'arrow'} className="h-4 w-4" strokeWidth={3} />
              </a>
            ))}
          </div>
        )}

        <SketchRule className="mt-8 text-ink" />

        <div className="marginalia mt-7">{post.body}</div>

        {post.links.length > 0 && (
          <section className="mt-14">
            <p className="label flex items-center gap-2 text-pencil">
              <Doodle name="bookmark" className="h-4 w-4 text-marker" strokeWidth={3} />
              sources
            </p>
            <ul className="doodle-list mt-3 space-y-2 text-[18px]">
              {post.links.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noreferrer" className="link">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="link">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12">
          <SketchRule className="text-ink/40" />
          <p className="mt-4 text-[16px] leading-snug text-pencil">
            {post.kind === 'PAPER'
              ? 'Unpublished manuscript. Not peer reviewed; no priority claim is made.'
              : 'Lab note. Describes the conditions a result was produced under, not a new claim.'}
          </p>
        </div>
      </article>
    </main>
  );
}
