import { Rule as SketchRule } from '@/components/sketch';
import { Doodle } from '@/components/doodles';

export const metadata = { title: 'Privacy' };

const SECTIONS: [string, string][] = [
  [
    'What this site collects',
    'Nothing. There are no accounts, no sign-in, no cookies set by us, no analytics and no third-party trackers. Every page is readable without identifying yourself.',
  ],
  [
    'Server logs',
    'Our host records standard request metadata — IP address, user agent, path and timestamp — for delivery and abuse prevention. No profiles are built from it and nothing is sold or shared.',
  ],
  [
    'If you write to us',
    'Messages sent by email, GitHub or Discord are kept only as long as needed to answer them. Nothing from a conversation is published without asking first.',
  ],
  [
    'Research data',
    'Published experiments use public model checkpoints and synthetic item sets; they contain no personal data. Raw records are published with each paper so the analysis can be re-run.',
  ],
  ['Changes', 'If this policy changes materially, the date below changes with it.'],
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-measure px-5 py-10 md:px-10 md:py-14">
      <p className="label flex items-center gap-2 text-pencil">
        <Doodle name="eye" className="h-4 w-4 text-marker" strokeWidth={3} />
        legal
      </p>
      <h1 className="mt-3 font-marker text-[clamp(32px,5vw,44px)] leading-[0.98]">
        Privacy Policy
      </h1>
      <p className="mt-2 text-[17px] text-pencil">Last updated 9 November 2026</p>

      <SketchRule className="mt-6 text-ink" />

      <div>
        {SECTIONS.map(([title, body]) => (
          <section key={title} className="py-5">
            <h2 className="font-marker text-[22px] leading-tight">{title}</h2>
            <p className="mt-1.5 text-[18px] leading-[1.55] text-pencil">{body}</p>
            <SketchRule className="mt-5 text-ink/25" />
          </section>
        ))}
      </div>
    </main>
  );
}
