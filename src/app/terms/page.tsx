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
    <main className="mx-auto max-w-measure px-6 py-14 md:px-10">
      <p className="mono-label">Legal</p>
      <h1 className="mt-4 font-serif text-[40px] leading-tight tracking-[-0.02em]">Terms of Use</h1>
      <p className="mt-2 font-serif text-[15px] text-muted">Last updated 9 November 2026</p>

      <div className="mt-10 border-t border-ink">
        {SECTIONS.map(([title, body]) => (
          <section key={title} className="border-b border-rule py-6">
            <h2 className="font-serif text-[20px]">{title}</h2>
            <p className="mt-2 font-serif text-[16.5px] leading-[1.65] text-muted">{body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
