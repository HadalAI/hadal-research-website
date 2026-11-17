export const metadata = { title: 'Privacy' };

const SECTIONS: [string, string][] = [
  [
    'What this site collects',
    'Nothing. There are no accounts, no sign-in, no cookies set by us, no analytics and no third-party trackers. Every page is readable without identifying yourself.',
  ],
  [
    'Server logs',
    'Our host records standard request metadata — IP address, user agent, path and timestamp — for delivery and abuse prevention. No profiles are built from it and nothing is sold or shared.',
  ],
  [
    'If you write to us',
    'Messages sent by email, GitHub or Discord are kept only as long as needed to answer them. Nothing from a conversation is published without asking first.',
  ],
  [
    'Research data',
    'Published experiments use public model checkpoints and synthetic item sets; they contain no personal data. Raw records are published with each paper so the analysis can be re-run.',
  ],
  [
    'Changes',
    'If this policy changes materially, the date below changes with it.',
  ],
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-measure px-6 py-14 md:px-10">
      <p className="mono-label">Legal</p>
      <h1 className="mt-4 font-serif text-[40px] leading-tight tracking-[-0.02em]">
        Privacy Policy
      </h1>
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
