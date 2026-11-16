import { Rule as SketchRule } from '@/components/sketch';
import { Doodle } from '@/components/doodles';

export const metadata = { title: 'Terms' };

const SECTIONS: [string, string][] = [
  [
    '1. What this site is',
    'The public record of Hadal Research: a research agenda, preprints, method notes and model documentation. It is not a service, an account system or a marketplace.',
  ],
  [
    '2. Research status',
    'Papers published here are preprints unless marked otherwise. They are not peer reviewed, they may be corrected, and no priority claim is made. Where a correction changes a verdict, the correction log is published alongside it.',
  ],
  [
    '3. Licensing',
    'Site source code is Apache-2.0. Paper code is MIT. Paper text, documentation and data are CC BY 4.0. Attribution should follow the citation metadata shipped with each paper.',
  ],
  [
    '4. No warranty',
    'Content is provided “as is”, without warranty of any kind. Results describe the conditions recorded in each paper and should not be assumed to transfer to other models, hardware or prompts.',
  ],
  [
    '5. Limitation of liability',
    'To the maximum extent permitted by law, the lab and its authors are not liable for any indirect or consequential loss arising from use of this site or from reliance on a published result.',
  ],
  [
    '6. Contact',
    'Questions about a result are best raised as an issue on the repository that ships its records.',
  ],
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-measure px-5 py-10 md:px-10 md:py-14">
      <p className="label flex items-center gap-2 text-pencil">
        <Doodle name="bookmark" className="h-4 w-4 text-marker" strokeWidth={3} />
        legal
      </p>
      <h1 className="mt-3 font-marker text-[clamp(32px,5vw,44px)] leading-[0.98]">Terms of Use</h1>
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
