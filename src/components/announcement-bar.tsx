import Link from 'next/link';

/** Site-wide announcement strip. Shown above the nav on every page. */
export default function AnnouncementBar() {
  return (
    <div className="border-b border-[#161a1e] bg-gradient-to-r from-[#04121c] via-[#061624] to-[#04121c]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-4 py-2 text-center font-mono text-[11px] sm:px-6">
        <span className="dot-live h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
        <span className="text-[#c7ccd1]">
          <b className="font-medium text-white">First training run starts September 1</b>
          <span className="hidden xs:inline sm:inline"> — connect your GPU and be part of it.</span>
        </span>
        <Link
          href="/contribute"
          className="font-medium text-[#7dd3fc] transition-colors hover:text-white"
        >
          Contribute →
        </Link>
      </div>
    </div>
  );
}
