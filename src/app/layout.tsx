import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import AnnouncementBar from '@/components/announcement-bar';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Hadal Research',
    template: '%s — Hadal Research',
  },
  description:
    'Intelligence, built together. A community-driven AI research lab — contribute compute, data, evaluation, and research.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-[#030405] font-sans text-[#f5f5f2] antialiased">
        <div className="sticky top-0 z-50">
          <AnnouncementBar />
          <Navigation />
        </div>
        {children}
        <footer className="border-t hairline py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <span className="mono-label">HADAL RESEARCH / HADAL.RUN</span>
            <nav className="flex items-center gap-5 font-mono text-xs text-[#555b61]">
              <a href="/privacy" className="transition-colors hover:text-[#f5f5f2]">Privacy</a>
              <a href="/terms" className="transition-colors hover:text-[#f5f5f2]">Terms</a>
              <a href="https://github.com/HadalAI" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#f5f5f2]">GitHub</a>
              <span>open source · Apache-2.0 · © {new Date().getFullYear()}</span>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}