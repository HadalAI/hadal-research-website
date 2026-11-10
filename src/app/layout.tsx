import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Newsreader } from 'next/font/google';
import './globals.css';

const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-newsreader',
});

export const metadata: Metadata = {
  title: {
    default: 'Hadal Research',
    template: '%s — Hadal Research',
  },
  description:
    'Hadal Research is a small lab studying hybrid language models — how attention, recurrence and retrieval are combined — and the measurement methods that decide whether a change is real.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-paper font-serif text-ink antialiased">
        <div className="border-b border-rule">
          <div className="mx-auto flex max-w-page items-baseline justify-between gap-8 px-6 py-3 md:px-10">
            <p className="mono-label">
              Hadal Research <span className="px-2 text-rule">/</span> Technical report series
            </p>
            <p className="mono-label hidden sm:block">Est. 2026 · Vol. 01</p>
          </div>
        </div>

        <Navigation />

        {children}

        <footer className="mt-24 border-t border-rule">
          <div className="mx-auto max-w-page px-6 py-14 md:px-10">
            <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
              <div>
                <p className="font-serif text-2xl leading-tight">
                  Hadal Research<span className="text-accent">.</span>
                </p>
                <p className="mt-3 max-w-[38ch] font-serif text-[15px] leading-relaxed text-muted">
                  A small lab working on hybrid language models and on the measurement methods
                  that decide whether a change is real.
                </p>
              </div>
              <div>
                <p className="mono-label">Pages</p>
                <ul className="mt-4 space-y-1.5 font-serif text-[15px]">
                  {[
                    ['/research', 'Research'],
                    ['/publications', 'Publications'],
                    ['/blog', 'Notes'],
                    ['/models', 'Models'],
                    ['/compute', 'Compute'],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="link">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mono-label">Colophon</p>
                <p className="mt-4 font-serif text-[15px] leading-relaxed text-muted">
                  Set in Newsreader and Geist Mono. Site source Apache-2.0; papers CC BY 4.0.
                </p>
                <p className="mono-label mt-5">
                  <a
                    href="https://github.com/HadalAI"
                    className="link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub ↗
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-12 flex flex-col gap-2 border-t border-rule pt-6 md:flex-row md:items-center md:justify-between">
              <p className="mono-label">© {new Date().getFullYear()} Hadal Research</p>
              <p className="mono-label flex gap-5">
                <Link href="/privacy" className="link">
                  Privacy
                </Link>
                <Link href="/terms" className="link">
                  Terms
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
