import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
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
        <Navigation />
        {children}
        <footer className="border-t hairline py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <span className="mono-label">HADAL RESEARCH / HADAL.RUN</span>
            <span className="font-mono text-xs text-[#555b61]">
              open source · Apache-2.0 · © {new Date().getFullYear()}
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
