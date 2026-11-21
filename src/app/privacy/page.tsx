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
    <main className="shell pb-4">
      <header className="pt-14 pb-8">
        <h1 className="display page-title m-0">Privacy Policy</h1>
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
