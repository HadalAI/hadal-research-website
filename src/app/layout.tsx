import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hadal Research',
  description: 'Intelligence, built together.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-deep text-foreground antialiased">
        <header className="container mx-auto px-4 pt-8">
          <Image
            src="/logo.svg"
            alt="Hadal Research"
            width={220}
            height={73}
            priority
          />
        </header>
        {children}
      </body>
    </html>
  );
}
