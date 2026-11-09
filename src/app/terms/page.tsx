export const metadata = { title: 'Terms' };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-32">
      <p className="mono-label pt-20">LEGAL</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Terms of Use</h1>
      <p className="mt-2 text-xs text-[#555b61]">Last updated: November 9, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#c9cdd2]">
        <section>
          <h2 className="mb-3 font-medium text-white">1. What this site is</h2>
          <p>
            The public record of Hadal Research: a research agenda, preprints, method notes and model
            documentation. It is not a service, an account system or a marketplace.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">2. Research status</h2>
          <p>
            Papers published here are preprints unless marked otherwise. They are not peer reviewed,
            they may be corrected, and no priority claim is made. Where a correction changes a
            verdict, the correction log is published alongside it.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">3. Licensing</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Site source code: Apache-2.0.</li>
            <li>Paper code: MIT.</li>
            <li>Paper text, documentation and data: CC BY 4.0.</li>
          </ul>
          <p className="mt-3">Attribution should follow the citation metadata shipped with each paper.</p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">4. No warranty</h2>
          <p>
            Content is provided “as is”, without warranty of any kind. Results describe the
            conditions recorded in each paper and should not be assumed to transfer to other models,
            hardware or prompts.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">5. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, the lab and its authors are not liable for any
            indirect or consequential loss arising from use of this site or from reliance on a
            published result.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">6. Contact</h2>
          <p>
            Questions about a result are best raised as an issue on the repository that ships its
            records.
          </p>
        </section>
      </div>
    </main>
  );
}
