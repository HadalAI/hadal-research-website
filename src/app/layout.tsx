import type { Metadata } from 'next';
import Header from '@/components/header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hadal Research',
  description: 'Intelligence, built together.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#05060c] text-[#eff0f2] antialiased selection:bg-[#6881a3]/30">
        <Header />
        {children}
        <footer className="border-t border-white/5 py-10">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-[#8b93a1] md:flex-row">
            <span>Hadal Research — Intelligence, built together.</span>
            <span className="font-mono text-xs">open source · Apache-2.0</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
