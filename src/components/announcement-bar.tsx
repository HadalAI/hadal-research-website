import Link from 'next/link';

/** Site-wide announcement strip — sticky above the nav on every page. */
export default function AnnouncementBar() {
  return (
    <div className="sticky top-0 z-[60] border-b border-sky-400/20 bg-gradient-to-r from-[#062033] via-[#0a2c47] to-[#062033] shadow-[0_0_24px_rgba(56,189,248,0.25)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-4 py-2.5 text-center font-mono text-xs sm:px-6">
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
        </span>
        <span className="text-[#dbe4ec]">
          <b className="font-semibold text-white">First training run starts September 1</b>
          <span> — connect your GPU and be part of it.</span>
        </span>
        <Link
          href="/contribute"
          className="rounded-md bg-sky-400 px-2.5 py-1 font-semibold text-[#04121c] transition-colors hover:bg-white"
        >
          Contribute →
        </Link>
      </div>
    </div>
  );
}
