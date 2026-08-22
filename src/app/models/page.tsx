'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Model = { id: string; name: string; description: string; status: string };

export default function ModelsPage() {
  const [models, setModels] = useState<Model[] | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch(`${API}/models`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setModels)
      .catch(() => setErr(true));
  }, []);

  return (
    <main className="min-h-screen bg-deep text-foreground font-sans">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8 text-accent">Model Releases</h1>
        <p className="text-muted mb-8">
          Model releases built with the Hadal community.
        </p>
        {err ? (
          <p className="text-muted">Model index temporarily unavailable.</p>
        ) : !models ? (
          <p className="text-muted">Loading…</p>
        ) : models.length === 0 ? (
          <p className="text-muted">No models released yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {models.map((m) => (
              <div key={m.id} className="bg-card rounded-lg p-6">
                <div className="text-3xl font-bold text-accent mb-2">{m.name}</div>
                <p className="text-muted text-sm mb-3">{m.description}</p>
                <span className="text-sm px-2 py-1 rounded bg-surface text-muted">{m.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
