import type { ReactNode } from 'react';

/** Filters that make every 2px border look drawn. Mounted once, used by CSS. */
export function RoughDefs() {
  return (
    <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id="rough" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.024" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.1" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="rough-2" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.019" numOctaves="2" seed="13" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * A box drawn around content. The border lives on ::before so the displacement
 * filter roughens the line without touching the type inside.
 */
export function Frame({
  children,
  className = '',
  fill = false,
  tilt = 'none',
  tape = false,
  thin = false,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  fill?: boolean;
  tilt?: 'none' | 'l' | 'r' | 'l-lg' | 'r-lg';
  tape?: boolean;
  thin?: boolean;
  as?: 'div' | 'section' | 'article' | 'aside' | 'li';
}) {
  const tilts: Record<string, string> = {
    none: '',
    l: 'tilt-l',
    r: 'tilt-r',
    'l-lg': 'tilt-l-lg',
    'r-lg': 'tilt-r-lg',
  };
  return (
    <Tag
      className={[
        'sketch',
        fill ? 'sketch-fill' : '',
        thin ? 'sketch-thin' : '',
        tape ? 'tape' : '',
        tilts[tilt],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}

/** Text with a hand-drawn oval around it. */
export function Circled({
  children,
  className = '',
  color = 'var(--marker)',
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        fill="none"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]"
        aria-hidden="true"
      >
        <path d="M96 5.6c31-1 62 3 84 10 17 6 20 17 15 28-6 15-34 25-71 28-33 3-66 1-88-6C17 59 8 51 9 41 10 29 34 18 66 11c10-2 20-4 30-5z" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/** A rotated rubber-stamp label: PUBLISHED, PREPRINT, and so on. */
export function Stamp({
  children,
  className = '',
  color = 'var(--marker)',
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span className={`stamp ${className}`} style={{ color }}>
      {children}
    </span>
  );
}

/** A hairline drawn by hand. */
export function Rule({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 10"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={`h-2.5 w-full opacity-80 ${className}`}
      aria-hidden="true"
    >
      <path d="M3 6.2c66-3 132-4 198-1.4 66 2.6 132 3.2 198 .8 66-2.4 132-3 198-.4 60 2.4 120 2.6 180-.2" />
    </svg>
  );
}
