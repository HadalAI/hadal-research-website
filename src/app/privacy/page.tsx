import Doodle from '@/components/doodles';
import { Paper, SectionTitle, HandRule, DoodleRow } from '@/components/sketch';

export const metadata = { title: 'Privacy' };

const SECTIONS: [string, string][] = [
  ['What this site collects', 'Nothing. There are no accounts, no sign-in, no cookies set by us, no analytics and no third-party trackers. Every page is readable without identifying yourself.'],
  ['Server logs', 'Our host records standard request metadata — IP address, user agent, path and timestamp — for delivery and abuse prevention. No profiles are built from it and nothing is sold or shared.'],
  ['If you write to us', 'Messages sent by email, GitHub or Discord are kept only as long as needed to answer them. Nothing from a conversation is published without asking first.'],
  ['Research data', 'Published experiments use public model checkpoints and synthetic item sets; they contain no personal data. Raw records are published with each paper so the analysis can be re-run.'],
  ['Changes', 'If this policy changes materially, the date below changes with it.'],
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-measure px-5 pt-10 md:px-10">
      <p className="label flex items-center gap-2"><Doodle name="eye" className="h-6 w-6 text-marker" /> legal</p>
      <h1 className="mt-3 font-marker text-[clamp(34px,5vw,46px)] leading-none">Privacy Policy</h1>
      <p className="note mt-2 text-pencil">Last updated 9 November 2026</p>
      <DoodleRow count={10} className="justify-start" />
      <HandRule />
      {SECTIONS.map(([title, body], i) => (
        <section key={title} className="mb-7">
          <Paper variant={(i % 4) as 0 | 1 | 2 | 3} tilt={i % 2 === 0 ? 'l' : 'r'}>
            <h2 className="font-marker text-[23px] leading-tight">{title}</h2>
            <p className="mt-2 text-[18px] leading-snug">{body}</p>
          </Paper>
        </section>
      ))}
    </main>
  );
}
