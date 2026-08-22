import Link from 'next/link';
import NetworkField from '@/components/network-field';
import ActivityFeed from '@/components/activity-feed';
import { fetchWorkers } from '@/lib/data';
import LeaderboardTable from '@/components/leaderboard-table';

export default async function ModelsPage() {
  const workers = await fetchWorkers();
  return (
    <main>
      {/* MODELS */}
      <section className="mx-auto max-w-6xl px-6 pt-20">
        <p className="mono-label">ARTIFACTS</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">MODELS</h1>
        <ModelList />
      </section>

      {/* NETWORK */}
      <section className="relative mt-28 overflow-hidden border-y hairline">
        <NetworkField height={380} />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="mono-label mb-8">GLOBAL NETWORK</p>
            <p className="max-w-lg font-mono text-sm leading-relaxed text-[#8c9197]">
              Distributed scientific infrastructure. Every node is a person who
              chose to contribute hardware to open research.
            </p>
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <LeaderboardTable rows={workers} />
        <div className="mt-10">
          <ActivityFeed limit={5} />
        </div>
        <Link href="/contribute" className="btn btn-primary mt-16 inline-flex">
          Put your GPU on the board →
        </Link>
      </section>
    </main>
  );
}

async function ModelList() {
  const { fetchModels } = await import('@/lib/data');
  const models = await fetchModels();
  if (models.length === 0) {
    return (
      <p className="py-24 text-sm text-[#555b61]">
        No releases yet — HADAL-1 is the first community build, in preparation.
      </p>
    );
  }
  return (
    <div className="mt-20">
      {models.map((m) => (
        <article key={m.id} className="record border-t hairline py-14 last:border-b">
          <div className="grid gap-10 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="font-mono text-4xl tracking-tight text-[#f5f5f2] md:text-5xl">{m.name}</span>
            <div>
              <p className="mono-label">{m.description || 'COMMUNITY-BUILT LANGUAGE MODEL'}</p>
              <div className="mt-4 flex gap-8 font-mono text-xs text-[#555b61]">
                {m.contributors ? <span>{m.contributors.toLocaleString()} CONTRIBUTORS</span> : null}
                {m.gpu_hours ? <span>{Math.round(m.gpu_hours).toLocaleString()} GPU HOURS</span> : null}
                <span className={m.status === 'RELEASED' ? 'text-emerald-500' : 'text-[#8c9197]'}>
                  STATUS / {m.status}
                </span>
              </div>
            </div>
            {m.status === 'RELEASED' && (
              <a
                href={`https://huggingface.co/hadal-research/${m.id}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost whitespace-nowrap"
              >
                Explore model →
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
