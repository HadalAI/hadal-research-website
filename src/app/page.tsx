import { Button } from '@/components/ui/button';
import { LiveStats, LiveRuns } from '@/components/live';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-deep text-foreground font-sans">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 text-accent">
            Hadal Research
          </h1>
          <p className="text-xl text-muted mb-8">
            Intelligence, built together.
          </p>
          <p className="text-lg mb-10 max-w-2xl mx-auto">
            A community-driven AI research lab where people contribute compute,
            data, evaluation, research, and engineering to collaboratively build
            AI models.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Button asChild href="/contribute">
              <span>Contribute</span>
            </Button>
            <Button variant="outline" asChild href="/research">
              <span>Explore Research</span>
            </Button>
          </div>

          <LiveStats />

          <h2 className="text-xl font-bold mb-4">Featured Research</h2>
          <LiveRuns />
        </div>
      </div>
    </main>
  );
}
