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
        <div className="sheet">
          <header className="site-head">
            <Link href="/" className="wordmark">Hadal Research</Link>
            <Navigation />
          </header>
        </div>

        {children}

        <div className="sheet">
          <footer className="site-foot">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span>© {new Date().getFullYear()} Hadal Research</span>
              <span className="flex flex-wrap gap-4">
                <a href="https://github.com/HadalAI" target="_blank" rel="noreferrer">GitHub</a>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
