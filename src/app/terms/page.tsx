export const metadata = { title: 'Terms' };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-32">
      <p className="mono-label pt-20">LEGAL</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Terms &amp; Conditions</h1>
      <p className="mt-2 text-xs text-[#555b61]">Last updated: August 22, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#c9cdd2]">
        <section>
          <h2 className="mb-3 font-medium text-white">1. What Hadal Research is</h2>
          <p>
            An open, community-driven research network. Volunteers run the Hadal worker to
            contribute compute toward small-language-model research jobs defined by the maintainers.
            All code is open source under Apache-2.0.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">2. Your responsibilities as a contributor</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Only run the worker on hardware you own or have explicit permission to use.</li>
            <li>Do not run the worker on employer/university machines without authorization.</li>
            <li>Do not attempt to farm credits with fake workers, spoofed heartbeats, or duplicated results. Fraudulent contributions are revoked and accounts banned.</li>
            <li>Do not submit datasets or content you do not have the rights to share.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">3. What the software does on your machine</h2>
          <p>
            The worker registers your device, receives sandboxed research jobs, executes them, and
            reports results. It accesses only job-assigned data. It performs no other file access,
            collects no browsing or personal information, and can be paused or removed at any time
            (quit the app, delete <code className="font-mono text-xs text-[#8c9197]">~/.hadal/worker.json</code>).
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">4. No warranty</h2>
          <p>
            THE SERVICE AND SOFTWARE ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED. We make no guarantee of uninterrupted availability, job availability, or
            fitness for any purpose. You are responsible for the electricity, bandwidth, and wear
            involved in contributing compute.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">5. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, the Hadal Research maintainers shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages, or
            any loss of profits, data, or hardware, arising from your use of the service — even if
            advised of the possibility.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">6. Credits &amp; attribution</h2>
          <p>
            GPU hours and leaderboard positions are community recognition, not payment, and carry
            no monetary value. They cannot be sold or transferred. Maintainers may adjust or revoke
            credits obtained through abuse.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">7. Contributions license</h2>
          <p>
            By submitting datasets, evaluation results, or research outputs, you grant Hadal
            Research and the public a perpetual, worldwide, royalty-free license to use, distribute,
            and build upon those contributions as part of openly published research.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">8. Termination</h2>
          <p>
            You may stop contributing at any time. Maintainers may suspend accounts that violate
            these terms, break the network, or endanger other participants.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">9. Changes</h2>
          <p>
            These terms may be updated; material changes will be announced on the site. Continued
            use after changes take effect constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">10. Contact</h2>
          <p>
            Reach the maintainers via the Hadal Research Discord or GitHub organization
            (<span className="font-mono text-xs">HadalAI</span>).
          </p>
        </section>
      </div>
    </main>
  );
}
