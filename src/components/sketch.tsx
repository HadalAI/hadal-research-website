import type { ReactNode } from 'react';
import { Doodle, type DoodleName } from './doodles';

/** A sheet of paper whose edge was drawn, not rendered. */
export function Paper({
  children,
  variant = 0,
  tilt = 'none',
  className = '',
}: {
  children: ReactNode;
  variant?: 0 | 1 | 2 | 3;
  tilt?: 'none' | 'l' | 'r' | 'l-lg' | 'r-lg';
  className?: string;
}) {
  const tilts: Record<string, string> = {
    none: '', l: 'tilt-l', r: 'tilt-r', 'l-lg': 'tilt-l-lg', 'r-lg': 'tilt-r-lg',
  };
  return (
    <div className={`paper v${variant} ${tilts[tilt]} ${className}`}>
      {children}
    </div>
  );
}

/** A handwritten heading with a wobbly ink underline and a doodle in the corner. */
export function SectionTitle({
  children,
  icon,
  className = '',
}: {
  children: ReactNode;
  icon?: DoodleName;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end gap-3 ${className}`}>
      {icon && <Doodle name={icon} className="h-10 w-10 text-marker" strokeWidth={2.6} />}
      <h2 className="font-marker text-[34px] leading-none md:text-[40px]">
        <span className="relative inline-block">
          {children}
          <svg
            viewBox="0 0 300 12"
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="absolute -bottom-2 left-0 h-3 w-full text-marker"
            aria-hidden="true"
          >
            <path d="M2 8c38-4 76-5 114-2s76 3 114-.4c24-1.8 46-2 68-.6" />
          </svg>
        </span>
      </h2>
    </div>
  );
}

/** A line ruled by hand, with doodles sitting on it. */
export function HandRule({ doodles = true }: { doodles?: boolean }) {
  return (
    <div className="my-9">
      {doodles && <DoodleRow count={9} />}
      <svg
        viewBox="0 0 800 12"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="h-3 w-full opacity-80"
        aria-hidden="true"
      >
        <path d="M3 7.5c70-3.5 140-4 210-1.2s140 3 210 .6 140-3.4 210-.8c20 .8 40 1.2 60 .9" />
      </svg>
    </div>
  );
}

const ROW: DoodleName[] = [
  'star', 'flower', 'wave', 'eye', 'fish', 'sun', 'leaf', 'asterisk',
  'heart', 'smile', 'cloud', 'pencil', 'book', 'bulb', 'note', 'spiral',
  'compass', 'search', 'flask', 'pin', 'clock', 'house', 'bookmark', 'plane',
];

/** Doodles scattered loose on the paper. */
export function DoodleRow({ count = 12, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 pb-2 ${className}`} aria-hidden="true">
      {ROW.slice(0, count).map((name, i) => (
        <Doodle
          key={name}
          name={name}
          className={`${i % 4 === 0 ? 'h-8 w-8' : 'h-5 w-5'} ${i % 3 === 0 ? 'text-marker' : ''}`}
          strokeWidth={i % 2 ? 2.2 : 2.7}
        />
      ))}
    </div>
  );
}

/** Text inside a hand-drawn oval. */
export function Circled({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="pointer-events-none absolute -inset-x-4 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+2rem)] text-marker"
        aria-hidden="true"
      >
        <path d="M97 5c31-1.5 62 3 85 10 17 5 21 17 15 28-6 15-35 25-72 28-34 3-67 1-89-6C16 58 7 50 8 40 9 28 33 17 65 10c11-3 21-4 32-5z" />
        <path d="M95 9c28-1 57 3 78 9" strokeOpacity=".35" strokeWidth="1.2" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/** A status written in the margin and circled in red. */
export function Stamp({ children }: { children: ReactNode }) {
  return (
    <Circled className="font-note text-[19px] font-semibold uppercase tracking-widest text-marker">
      {children}
    </Circled>
  );
}

/** A hand-drawn arrow that points at whatever follows. */
export function PointArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-12 w-16 text-marker ${className}`}
      aria-hidden="true"
    >
      <path d="M4 8c3 18 11 31 25 40 11 7 24 10 39 10" />
      <path d="M55 50c5 4 9 7 14 9-1 6-3 11-6 15" />
      <path d="M68 58c4 1 7 1 10 1" />
    </svg>
  );
}
