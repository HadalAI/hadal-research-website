export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-32">
      <p className="mono-label pt-20">LEGAL</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-xs text-[#555b61]">Last updated: August 22, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#c9cdd2]">
        <section>
          <h2 className="mb-3 font-medium text-white">What we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>Account basics.</strong> When you sign in with GitHub or Discord, we store your username, account ID, and avatar URL. Nothing else from those platforms.</li>
            <li><strong>Machine telemetry.</strong> If you run the Hadal worker, we store the machine identifier, GPU name, VRAM size, utilization and temperature readings, and contributed hours. This is what powers the public network stats.</li>
            <li><strong>Job results.</strong> Outputs of research jobs your machine executes, attributed to a random worker ID.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">What we never collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>No email addresses (unless you later choose to provide one).</li>
            <li>No personal files. The worker only touches job data assigned by the network — it never reads your documents, photos, or browsing history.</li>
            <li>No cookies for advertising, ever. The single functional cookie/localStorage entry is your own login session.</li>
            <li>No analytics or third-party trackers.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">How your data is used</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Usernames may appear on public leaderboards and contributor walls (that is the point of community credit).</li>
            <li>Aggregate statistics (total workers, total hours) are public. Individual machine telemetry is visible only to you on your dashboard.</li>
            <li>We do not sell or share data with anyone. There is no revenue model that involves your data.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">Storage &amp; security</h2>
          <p>
            Data lives in an encrypted managed Postgres database (Neon, US region). Sessions are
            256-bit tokens valid 30 days. Worker keys are stored hashed where possible and can be
            revoked individually at any time from your dashboard.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">Your controls</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>Delete a key</strong> — unlinks that machine instantly.</li>
            <li><strong>Sign out</strong> — clears your local session.</li>
            <li><strong>Account deletion</strong> — contact us (Discord or GitHub) and we remove your account, machines, and stats. Open-source means you can also verify everything we claim by reading the code.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">Children</h2>
          <p>Hadal Research is not directed at children under 13 (16 in the EEA), and we do not knowingly collect their data.</p>
        </section>

        <section>
          <h2 className="mb-3 font-medium text-white">Changes</h2>
          <p>If this policy changes materially, we will announce it on the site before it takes effect.</p>
        </section>
      </div>
    </main>
  );
}
