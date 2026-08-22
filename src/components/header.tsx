'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

const links = [
  { href: '/', label: 'Home' },
  { href: '/research', label: 'Research' },
  { href: '/models', label: 'Models' },
  { href: '/contribute', label: 'Contribute' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#05060c]/70 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="Hadal Research" width={150} height={50} priority />
        </Link>
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] px-2 py-1.5 backdrop-blur-xl">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${
                pathname === l.href
                  ? 'bg-white/10 text-white'
                  : 'text-[#8b93a1] hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="md:hidden text-[#8b93a1] hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-white/5 bg-[#05060c]/95 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-4 py-2.5 text-sm ${
                pathname === l.href ? 'bg-white/10 text-white' : 'text-[#8b93a1]'
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
