import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import './fonts.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Hadal Research', template: '%s — Hadal Research' },
  description:
    'Hadal Research is a small lab studying hybrid language models and the measurement methods that decide whether a change is real.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell wide">
          <header className="site-head">
            <Link href="/" className="wordmark">Hadal Research</Link>
            <Navigation />
          </header>
        </div>

        {children}

        <div className="shell wide">
          <footer className="site-foot">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="m-0">© {new Date().getFullYear()} Hadal Research · site Apache-2.0, papers CC BY 4.0</p>
              <p className="m-0 flex flex-wrap gap-5">
                <a href="https://github.com/HadalAI" target="_blank" rel="noreferrer">GitHub</a>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
