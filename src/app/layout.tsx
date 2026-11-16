import type { Metadata } from 'next';
import Link from 'next/link';
import { Doodle, type DoodleName } from '@/components/doodles';
import { DoodleRow, HandRule } from '@/components/sketch';
import './fonts.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Hadal Research', template: '%s — Hadal Research' },
  description:
    'Hadal Research is a small lab studying hybrid language models and the measurement methods that decide whether a change is real.',
};

const NAV: { href: string; label: string; icon: DoodleName }[] = [
  { href: '/research', label: 'Research', icon: 'compass' },
  { href: '/publications', label: 'Publications', icon: 'book' },
  { href: '/blog', label: 'Notes', icon: 'pencil' },
  { href: '/models', label: 'Models', icon: 'bulb' },
  { href: '/compute', label: 'Compute', icon: 'flask' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* top margin of the notebook */}
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-2 px-5 pt-5 md:px-10">
          <p className="mono-label flex items-center gap-2">
            <Doodle name="asterisk" className="h-5 w-5 text-marker" />
            Hadal Research <span className="text-pencil">/</span> keeping notes
          </p>
          <p className="note flex items-center gap-2 text-pencil">
            intelligence, built together
            <Doodle name="smile" className="h-6 w-6 text-marker" />
          </p>
        </div>

        <header className="mx-auto max-w-page px-5 pt-4 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Link href="/" className="group flex items-end gap-2" aria-label="Hadal Research, home">
              <Doodle name="sun" className="h-10 w-10 text-marker transition-transform group-hover:rotate-12" />
              <span className="font-marker text-[46px] leading-[0.85]">
                hadal<span className="text-marker">.</span>
              </span>
            </Link>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 pb-1">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group inline-flex items-center gap-1.5 py-1 text-[19px] transition-colors hover:text-marker"
                >
                  <Doodle name={l.icon} className="h-[18px] w-[18px] text-marker" strokeWidth={3} />
                  <span className="link">{l.label}</span>
                </Link>
              ))}
              <a
                href="https://github.com/HadalAI"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 text-[19px] hover:text-marker"
              >
                <span className="link">GitHub</span>
                <Doodle name="plane" className="h-4 w-4 text-marker" />
              </a>
            </nav>
          </div>
          <DoodleRow count={7} className="justify-start !pb-0" />
        </header>

        {children}

        <footer className="mx-auto max-w-page px-5 pb-10 md:px-10">
          <HandRule />
          <DoodleRow count={16} />
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-marker text-[30px]">hadal<span className="text-marker">.</span></p>
              <p className="mt-2 max-w-[34ch] text-[18px] leading-snug">
                A small lab working on hybrid language models and on measurements that can be checked.
              </p>
            </div>
            <div>
              <p className="label">pages</p>
              <ul className="mt-2 space-y-1">
                {NAV.map((l) => (
                  <li key={l.href} className="flex items-center gap-2">
                    <Doodle name={l.icon} className="h-4 w-4 text-marker" />
                    <Link href={l.href} className="link text-[18px]">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label">colophon</p>
              <p className="mt-2 text-[18px] leading-snug">
                Drawn in Permanent Marker, Patrick Hand and Caveat. Site Apache-2.0; papers CC BY 4.0.
              </p>
              <p className="mt-2 flex items-center gap-2 text-[18px]">
                <Doodle name="heart" className="h-5 w-5 text-marker" />
                © {new Date().getFullYear()} Hadal Research
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
