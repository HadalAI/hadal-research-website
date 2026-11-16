/**
 * The cover drawing: a line from the surface to the trench.
 * Drawn in one stroke language — 2.4px ink, round caps, nothing symmetrical.
 */
export default function HeroDoodle({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 470"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* surface */}
      <path d="M12 47c18-9 34-9 52 0s34 9 52 0 34-9 52 0 34 9 52 0 34-9 52 0 34 9 52 0 34-9 52 0 34 9 52 0 34-9 52 0 34 9 52 0" />
      <path d="M196 30c7-5 14-5 21 0M392 26c6-5 13-5 19 0" opacity="0.75" />

      {/* sun, half out of frame */}
      <circle cx="566" cy="58" r="21" />
      <path d="M566 21v-9M594 30l6-7M598 62h9M538 30l-6-6M533 62h-9" />

      {/* the descent */}
      <path
        d="M574 92c-2 25-12 44-30 57-20 15-46 18-68 27-25 10-42 29-44 55-2 25 14 44 33 57 17 12 27 27 25 45"
        strokeDasharray="5 9"
        opacity="0.85"
      />

      {/* submersible */}
      <g>
        <path d="M282 176c14-10 34-14 52-11 17 2 30 11 34 24 4 13-3 26-17 34-14 8-33 11-50 8-16-3-27-12-30-24-3-12 2-23 11-31z" />
        <circle cx="316" cy="193" r="12" />
        <circle cx="316" cy="193" r="4" />
        <path d="M372 186c9 2 15 8 15 15M374 202c7 3 11 7 9 12" />
        <path d="M282 186c-8 1-13 6-13 12s5 10 13 11" />
        <path d="M300 165c2-9 9-15 18-17M330 165c1-7 6-12 13-14" />
        <path d="M276 210c-14 9-24 20-30 33" strokeDasharray="3 8" opacity="0.7" />
      </g>

      {/* fish, passing */}
      <g opacity="0.9">
        <path d="M118 246c11-9 24-11 35-5 10 6 14 17 9 27-5 9-17 13-28 9-11-4-17-15-16-31z" />
        <path d="M161 258c8-2 14-6 17-12-1 8-3 15-7 21" />
        <circle cx="134" cy="252" r="2.6" />
      </g>
      <g opacity="0.7">
        <path d="M472 300c9-7 20-9 29-4 8 5 11 14 7 22-4 8-14 11-23 7-9-4-14-12-13-25z" />
        <path d="M508 310c6-2 11-5 14-10-1 7-2 12-5 17" />
        <circle cx="485" cy="305" r="2.2" />
      </g>

      {/* seabed */}
      <path d="M8 404c26-10 47-8 66 4 17 11 34 12 51 2 19-11 39-11 57 1 17 11 35 12 52 1 18-11 37-11 55 1 17 11 35 12 52 1 19-12 39-12 57 0 17 11 35 11 52-1 15-10 30-12 44-6" />
      <path d="M8 428c30 8 60 8 90 0s60-8 90 0 60 8 90 0 60-8 90 0 60 8 90 0 60-8 90 0" opacity="0.55" />

      {/* rocks and weed */}
      <path d="M96 404c4-16 9-26 15-31 5 7 7 18 6 31" />
      <path d="M140 405c-2-13 1-23 8-30 4 8 4 19 1 30" />
      <path d="M486 404c-3-17 1-29 10-36 2 11 0 24-4 36" />
      <path d="M520 405c2-11 7-19 15-23-1 9-5 17-10 23" />

      <path d="M226 406c-9-9-10-19-3-27 9-10 23-10 32 0 7 8 6 18-2 27" opacity="0.9" />
      <path d="M241 379v-9M232 383l-6-6M250 383l6-6" opacity="0.6" />

      {/* starfish */}
      <path d="M404 412l4-11 4 11 11 1-8 7 3 11-10-6-10 6 3-11-8-7z" />
      <circle cx="560" cy="398" r="7" />
      <circle cx="574" cy="410" r="4" />

      {/* particles */}
      <g opacity="0.55">
        <path d="M86 132v10M81 137h10" />
        <path d="M492 164v9M487.5 168.5h9" />
        <path d="M210 318v8M206 322h8" />
        <path d="M356 356v9M351.5 360.5h9" />
        <path d="M590 236v8M586 240h8" />
        <path d="M40 330v7M36.5 333.5h7" />
      </g>
    </svg>
  );
}
