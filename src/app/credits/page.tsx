import Link from 'next/link';
import { fetchWorkers } from '@/lib/data';

export const metadata = { title: 'Credits' };

export default async function CreditsPage() {
  const workers = await fetchWorkers();
  const names = workers.map((w) => `worker_${w.id}`);
  return (
    <main className="mx-auto max-w-6xl px-6 pb-32">
      <p className="mono-label pt-20">ATTRIBUTION</p>
      <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
        BUILT BY PEOPLE.
      </h1>
      <p className="mt-8 max-w-lg text-sm leading-relaxed text-[#8c9197]">
        Every model remembers the people who helped build it.
      </p>
      <p className="mt-12 font-mono text-3xl text-[#f5f5f2] tabular">
        {workers.length.toLocaleString()} CONTRIBUTORS
      </p>

      <div className="mt-20">
        <p className="mono-label mb-8">COMPUTE / THE NETWORK</p>
        {names.length === 0 ? (
          <p className="text-sm text-[#555b61]">
            The credits roll when the first contributions land.{' '}
            <Link href="/contribute" className="text-[#5b8fa8] hover:text-[#8c9197]">
              Be first →
            </Link>
          </p>
        ) : (
          <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-[#8c9197]">
            {names.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-24 border-t hairline pt-12">
        <p className="mono-label mb-6">CATEGORIES</p>
        <div className="grid grid-cols-2 gap-8 font-mono text-xs text-[#555b61] md:grid-cols-4">
          <div>
            <p className="text-[#8c9197]">COMPUTE</p>
            <p className="mt-1 text-lg text-[#f5f5f2]">{workers.length}</p>
          </div>
          <div>
            <p className="text-[#8c9197]">DATA</p>
            <p className="mt-1 text-lg text-[#f5f5f2]">0</p>
          </div>
          <div>
            <p className="text-[#8c9197]">EVALUATION</p>
            <p className="mt-1 text-lg text-[#f5f5f2]">0</p>
          </div>
          <div>
            <p className="text-[#8c9197]">RESEARCH</p>
            <p className="mt-1 text-lg text-[#f5f5f2]">0</p>
          </div>
        </div>
      </div>
    </main>
  );
}
