import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
            <Button asChild>
              <Link href="/contribute">Contribute</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/research">Explore Research</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-12">
            <div>
              <div className="text-3xl font-bold text-acent mb-2">247</div>
              <div className="text-muted">Contributors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">12,483</div>
              <div className="text-muted">GPU hours</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">67%</div>
              <div className="text-muted">Complete</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">HADAL-001</div>
              <div className="text-muted">Research Run</div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Featured Research</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface/50 rounded-lg p-4 hover:transform hover:transition-all hover:hover:bg-surface/80 transition-all">
                <h3 className="font-bold mb-2">HADAL-001: Improving SLM Reasoning</h3>
                <p className="text-muted text-sm">Community evaluation of open models</p>
                <Link href="/research/hadal-001">
                  <Button variant="link" size="sm">View Run</Button>
                </Link>
              </div>
              <div className="bg-surface/50 rounded-lg p-4 hover:transform hover:transition-all hover:hover:bg-surface/80 transition-all">
                <h3 className="font-bold mb-2">HADAL-002: Preference Dataset</h3>
                <p className="text-muted text-sm">Model comparison evaluations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
