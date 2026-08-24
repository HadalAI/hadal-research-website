'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/components/sign-in';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type MyDataset = {
  id: string;
  name: string;
  url: string;
  status: string;
  created_at: number;
};

/** Dashboard section: the user's dataset submissions with review status. */
export default function MyDatasets() {
  const [mine, setMine] = useState<MyDataset[] | null>(null);

  useEffect(() => {
    if (!getToken()) return;
    fetch(`${API}/account/datasets`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setMine)
      .catch(() => setMine([]));
  }, []);

  if (!mine) return null;

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-[#f5f5f2]">Dataset submissions</h2>
          <p className="mt-1 text-xs text-[#555b61]">
            Datasets you&apos;ve offered to the community shelf, and their review status.
          </p>
        </div>
        <Link href="/contribute" className="shrink-0 text-xs text-[#5b8fa8] hover:text-white">
          Submit one →
        </Link>
      </div>
      {mine.length === 0 ? (
        <div className="rounded-xl border border-[#161a1e] bg-[#07090b] p-8 text-center font-mono text-xs text-[#8c9197]">
          No submissions yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#161a1e]">
          {mine.map((d, i) => (
            <div
              key={d.id}
              className={`flex items-center justify-between gap-4 bg-[#07090b] px-5 py-3.5 ${i > 0 ? 'border-t border-[#161a1e]' : ''}`}
            >
              <span className="truncate font-mono text-xs text-[#f5f5f2]">{d.name}</span>
              <span
                className={`shrink-0 font-mono text-[10px] ${
                  d.status === 'APPROVED'
                    ? 'text-emerald-500'
                    : d.status === 'REJECTED'
                      ? 'text-red-500'
                      : 'text-[#8c9197]'
                }`}
              >
                {d.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
