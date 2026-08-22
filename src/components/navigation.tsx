'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

const links = [
  { href: '/research', label: 'Research' },
  { href: '/models', label: 'Models' },
  { href: '/network', label: 'Network' },
  { href: '/contribute', label: 'Contribute' },
  { href: '/credits', label: 'Credits' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-[#030405]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Hadal Research home">
          <Image src="/logo.svg" alt="HADAL" width={128} height={43} priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors duration-200 ${
                pathname === l.href ? 'text-[#f5f5f2]' : 'text-[#555b61] hover:text-[#f5f5f2]'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/kyssta-exe/hadal-worker"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost !px-4 !py-2"
          >
            Sign in
          </a>
        </nav>

        <button
          className="text-[#8c9197] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t hairline px-6 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 text-sm ${
                pathname === l.href ? 'text-[#f5f5f2]' : 'text-[#555b61]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
