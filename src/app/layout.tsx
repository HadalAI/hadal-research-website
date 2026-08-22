import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hadal Research',
  description: 'Intelligence, built together.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-deep text-foreground antialiased">{children}</body>
    </html>
  );
}
