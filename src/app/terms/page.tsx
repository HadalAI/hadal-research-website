import Doodle from '@/components/doodles';
import { Paper, HandRule, DoodleRow } from '@/components/sketch';

export const metadata = { title: 'Terms' };

const SECTIONS: [string, string][] = [
  ['1. What this site is', 'The public record of Hadal Research: a research agenda, preprints, method notes and model documentation. It is not a service, an account system or a marketplace.'],
  ['2. Research status', 'Papers published here are preprints unless marked otherwise. They are not peer reviewed, they may be corrected, and no priority claim is made. Where a correction changes a verdict, the correction log is published alongside it.'],
  ['3. Licensing', 'Site source code is Apache-2.0. Paper code is MIT. Paper text, documentation and data are CC BY 4.0. Attribution should follow the citation metadata shipped with each paper.'],
  ['4. No warranty', 'Content is provided “as is”, without warranty of any kind. Results describe the conditions recorded in each paper and should not be assumed to transfer to other models, hardware or prompts.'],
  ['5. Limitation of liability', 'To the maximum extent permitted by law, the lab and its authors are not liable for any indirect or consequential loss arising from use of this site or from reliance on a published result.'],
  ['6. Contact', 'Questions about a result are best raised as an issue on the repository that ships its records.'],
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-measure px-5 pt-10 md:px-10">
      <p className="label flex items-center gap-2"><Doodle name="bookmark" className="h-6 w-6 text-marker" /> legal</p>
      <h1 className="mt-3 font-marker text-[clamp(34px,5vw,46px)] leading-none">Terms of Use</h1>
      <p className="note mt-2 text-pencil">Last updated 9 November 2026</p>
      <DoodleRow count={10} className="justify-start" />
      <HandRule />
      {SECTIONS.map(([title, body], i) => (
        <section key={title} className="mb-7">
          <Paper variant={(i % 4) as 0 | 1 | 2 | 3} tilt={i % 2 === 0 ? 'r' : 'l'}>
            <h2 className="font-marker text-[23px] leading-tight">{title}</h2>
            <p className="mt-2 text-[18px] leading-snug">{body}</p>
          </Paper>
        </section>
      ))}
    </main>
  );
}
