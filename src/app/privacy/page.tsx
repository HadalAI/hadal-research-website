export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-32">
      <p className="mono-label pt-20">LEGAL</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-xs text-[#555b61]">Last updated: November 9, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#c9cdd2]">
        <section>
          <h2 className="mb-3 font-medium text-white">What this site collects</h2>
          <p>
            Nothing. There are no accounts, no sign-in, no cookies set by us, no analytics and no
            third-party trackers. Every page is readable without identifying yourself.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">Server logs</h2>
          <p>
            Our host records standard request metadata — IP address, user agent, path and timestamp —
            for delivery and abuse prevention. No profiles are built from it and nothing is sold or
            shared.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">If you contact us</h2>
          <p>
            Messages sent to the lab by email, GitHub or Discord are kept only as long as needed to
            answer them. Nothing from a conversation is published without asking first.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">Research data</h2>
          <p>
            Published experiments use public model checkpoints and synthetic item sets; they contain
            no personal data. Raw records are published with each paper so the analysis can be
            re-run.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">Changes</h2>
          <p>If this policy changes materially, the date above changes with it.</p>
        </section>
      </div>
    </main>
  );
}
