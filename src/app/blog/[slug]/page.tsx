import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Doodle from '@/components/doodles';
import { Circled, HandRule, DoodleRow } from '@/components/sketch';
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
    <main className="mx-auto max-w-page px-5 md:px-10">
      <div className="mx-auto max-w-measure pt-8">
        <p className="flex items-center gap-2 text-[18px]">
          <Doodle name="arrow" className="h-5 w-5 rotate-180 text-marker" />
          <Link href="/blog" className="link">all notes</Link>
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Circled className="note text-[19px] font-semibold uppercase text-marker">{post.kind}</Circled>
          <p className="note">{post.displayDate} · {post.readingTime}</p>
        </div>

        <h1 className="mt-5 text-balance text-[clamp(32px,4.4vw,46px)] leading-[1.1]">{post.title}</h1>

        <p className="mt-3 flex items-center gap-2 text-[19px]">
          <Doodle name="pencil" className="h-5 w-5 text-marker" /> {post.authors}
        </p>
        <p className="note mt-3 text-pencil">{post.tags.join(' · ')}</p>

        <div className="mt-5 flex flex-wrap gap-4">
          {post.links.slice(0, 2).map((l) => (
            <a key={l.href} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined} className="btn">
              {l.label}<Doodle name={l.external ? 'plane' : 'arrow'} className="h-4 w-4" />
            </a>
          ))}
        </div>

        <DoodleRow count={14} />
      </div>

      <article className="mx-auto max-w-measure pb-14">
        <div className="marginalia">{post.body}</div>
        <HandRule />

        {post.links.length > 0 && (
          <section>
            <p className="label flex items-center gap-2"><Doodle name="bookmark" className="h-5 w-5 text-marker" /> sources</p>
            <ul className="doodle-list mt-2 space-y-2 text-[18px]">
              {post.links.map((l) => (
                <li key={l.href}>{l.external
                  ? <a href={l.href} target="_blank" rel="noreferrer" className="link">{l.label}</a>
                  : <Link href={l.href} className="link">{l.label}</Link>}</li>
              ))}
            </ul>
          </section>
        )}
        <p className="mt-8 text-[17px] text-pencil">
          {post.kind === 'PAPER'
            ? 'Unpublished manuscript. Not peer reviewed; no priority claim is made.'
            : 'Lab note. Describes the conditions a result was produced under, not a new claim.'}
        </p>
      </article>
    </main>
  );
}
