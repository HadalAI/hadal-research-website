'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/research', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/blog', label: 'Notes' },
  { href: '/models', label: 'Models' },
  { href: '/compute', label: 'Compute' },
];

export default function Navigation() {
  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="border-b border-accent/35">
      <div className="mx-auto flex max-w-page flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-6 py-6 md:px-10">
        <Link href="/" className="font-serif text-[26px] leading-none tracking-[-0.01em]">
          Hadal<span className="text-accent">.</span>
        </Link>

        <nav className="flex flex-wrap items-baseline gap-x-7 gap-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`mono-label -my-1 py-1 transition-colors hover:text-ink ${
                isCurrent(l.href) ? 'text-ink' : ''
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/HadalAI"
            target="_blank"
            rel="noreferrer"
            className="mono-label -my-1 py-1 transition-colors hover:text-ink"
            aria-label="HadalAI on GitHub"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
