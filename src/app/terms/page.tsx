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
    <main className="shell pb-4">
      <header className="pt-14 pb-8">
        <h1 className="display page-title m-0">Terms of Use</h1>
        <p className="meta mt-4 mb-0">Last updated 9 November 2026</p>
      </header>
      <div className="stack-sm">
        {SECTIONS.map(([title, body]) => (
          <section key={title}>
            <h2 className="section-title">{title}</h2>
            <p className="muted mb-0">{body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
