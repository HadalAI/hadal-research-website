'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Doodle, type DoodleName } from '@/components/doodles';

const links: { href: string; label: string; icon: DoodleName }[] = [
  { href: '/research', label: 'Research', icon: 'compass' },
  { href: '/publications', label: 'Publications', icon: 'book' },
  { href: '/blog', label: 'Notes', icon: 'pencil' },
  { href: '/models', label: 'Models', icon: 'bulb' },
  { href: '/compute', label: 'Compute', icon: 'flask' },
];

export default function Navigation() {
  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header id="top" className="mx-auto max-w-page px-5 pt-7 md:px-10 md:pt-9">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <Link href="/" className="group inline-block" aria-label="Hadal Research, home">
          <span className="font-marker text-[42px] leading-[0.9] tracking-tight">
            hadal<span className="text-marker">.</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 pb-1 sm:gap-x-5">
          {links.map((l) => {
            const active = isCurrent(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`group inline-flex items-center gap-1.5 py-2 text-[19px] leading-none transition-colors hover:text-marker ${
                  active ? 'text-ink' : 'text-ink/75'
                }`}
              >
                <Doodle
                  name={l.icon}
                  className={`h-[18px] w-[18px] transition-transform group-hover:-rotate-6 ${
                    active ? 'text-marker' : 'text-ink/50'
                  }`}
                  strokeWidth={2.9}
                />
                <span className={active ? 'swipe' : ''}>{l.label}</span>
              </Link>
            );
          })}

          <a
            href="https://github.com/HadalAI"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1 py-2 text-[19px] leading-none text-ink/75 transition-colors hover:text-marker"
            aria-label="HadalAI on GitHub"
          >
            GitHub
            <Doodle
              name="plane"
              className="h-[17px] w-[17px] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={3}
            />
          </a>
        </nav>
      </div>
    </header>
  );
}
