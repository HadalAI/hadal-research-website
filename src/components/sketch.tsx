import type { ReactNode } from 'react';
import { Doodle, type DoodleName } from './doodles';

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

/** Text, unadorned. The old circled treatment is gone. */
export function Circled({
  children,
  className: _className,
  color: _color,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return <>{children}</>;
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

const BAND: DoodleName[] = [
  'star', 'flower', 'wave', 'eye', 'fish', 'sun', 'leaf', 'asterisk',
  'heart', 'smile', 'cloud', 'pencil', 'compass', 'bulb', 'note', 'spiral',
];

/** A scatter of small ink drawings. Decorative; never a container. */
export function DoodleBand({
  className = '',
  count = 10,
}: {
  className?: string;
  count?: number;
}) {
  void BAND;
  void count;
  void className;
  /* No icon bands. Rules stay; the glyphs are gone. */
  return null;
}

/** No separators: pages flow as continuous text. */
export function Rule(_props: { className?: string; doodles?: boolean }) {
  return null;
}
