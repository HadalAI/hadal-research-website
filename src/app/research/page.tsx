import { LiveRuns } from '@/components/live';

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-deep text-foreground font-sans">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8 text-accent">
          Active Research
        </h1>
        <LiveRuns />
      </div>
    </main>
  );
}
