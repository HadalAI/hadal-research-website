import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import RunningHead from '@/components/running-head';
import { RoughDefs, Rule } from '@/components/sketch';
import { Doodle } from '@/components/doodles';
import './fonts.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Hadal Research',
    template: '%s — Hadal Research',
  },
  description:
    'Hadal Research is a small lab studying hybrid language models — how attention, recurrence and retrieval are combined — and the measurement methods that decide whether a change is real.',
};

const FOOTER_PAGES: [string, string, Parameters<typeof Doodle>[0]['name']][] = [
  ['/research', 'Research', 'compass'],
  ['/publications', 'Publications', 'book'],
  ['/blog', 'Notes', 'pencil'],
  ['/models', 'Models', 'bulb'],
  ['/compute', 'Compute', 'flask'],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper font-hand text-ink antialiased">
        <RoughDefs />

        {/* the top strip, ruled like a notebook margin */}
        <div className="border-b-2 border-ink/70">
          <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2 md:px-10">
            <p className="mono-label flex items-center gap-2">
              <Doodle name="asterisk" className="h-4 w-4" strokeWidth={3.4} />
              Hadal Research
              <span className="text-pencil">/</span>
              <span className="normal-case tracking-normal">a small lab, keeping notes</span>
            </p>
            <RunningHead />
          </div>
        </div>

        <Navigation />

        {children}

        <footer className="mt-20">
          <Rule className="text-ink" />
          <div className="mx-auto max-w-page px-5 py-12 md:px-10">
            <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
              <div>
                <p className="font-marker text-[30px] leading-none">
                  hadal<span className="text-marker">.</span>
                </p>
                <p className="mt-4 max-w-[36ch] text-[18px] leading-snug text-pencil">
                  A small lab working on hybrid language models, and on the measurement methods
                  that decide whether a change is real.
                </p>
                <div className="mt-5 flex gap-2 text-ink/80">
                  <Doodle name="wave" className="h-7 w-7" />
                  <Doodle name="fish" className="hidden h-7 w-7" />
                  <Doodle name="flower" className="h-7 w-7" />
                  <Doodle name="star" className="h-7 w-7" />
                  <Doodle name="heart" className="h-7 w-7" />
                </div>
              </div>

              <div>
                <p className="label">Pages</p>
                <ul className="mt-3 space-y-1.5 text-[18px]">
                  {FOOTER_PAGES.map(([href, label, icon]) => (
                    <li key={href}>
                      <Link href={href} className="link inline-flex items-center gap-2">
                        <Doodle name={icon} className="h-4 w-4 opacity-70" strokeWidth={3} />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="label">Colophon</p>
                <p className="mt-3 text-[17px] leading-snug text-pencil">
                  Set in Permanent Marker, Patrick Hand and Caveat. Lines drawn by hand, then
                  roughened with a turbulence filter. Site Apache-2.0; papers CC BY 4.0.
                </p>
                <p className="mt-4">
                  <a
                    href="https://github.com/HadalAI"
                    className="link inline-flex items-center gap-1.5 text-[17px]"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                    <Doodle name="arrow" className="h-4 w-4" strokeWidth={3.2} />
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="label text-pencil">© {new Date().getFullYear()} Hadal Research</p>
              <p className="flex items-center gap-5">
                <Link href="/privacy" className="link text-[17px]">
                  Privacy
                </Link>
                <Link href="/terms" className="link text-[17px]">
                  Terms
                </Link>
                <a href="#top" className="btn text-[16px]">
                  back to top
                  <Doodle name="arrowDown" className="h-4 w-4 -scale-y-100" strokeWidth={3.2} />
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
