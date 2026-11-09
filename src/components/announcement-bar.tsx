import Link from 'next/link';

/** Site-wide strip: the most recent publication, sticky above the nav. */
export default function AnnouncementBar() {
  return (
    <div className="sticky top-0 z-[60] border-b hairline bg-[#07090b]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-4 py-2.5 text-center font-mono text-[11px] sm:px-6">
        <span className="text-[#555b61]">PAPER</span>
        <span className="text-[#c9cdd2]">
          <b className="font-medium text-[#f5f5f2]">Changing One Word</b>
          <span className="text-[#555b61]"> — anchor direction in list indexing · v6</span>
        </span>
        <Link
          href="/blog/changing-one-word"
          className="text-[#7aa7c0] underline-offset-2 transition-colors hover:text-[#f5f5f2] hover:underline"
        >
          Read →
        </Link>
      </div>
    </div>
  );
}
