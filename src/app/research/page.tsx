import Link from 'next/link';

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-deep text-foreground font-sans">
      <div className="container mx-auto px-4 py-16">
        <nav className="mb-8">
          <Link href="/" className="text-accent font-medium hover:underline">
            ← Hadal Research
          </Link>
          <span className="mx-2">/</span>
          <span>Research</span>
        </nav>
        
        <h1 className="text-5xl font-bold mb-8 text-accent">
          Active Research
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg p-6">
            <div className="text-3xl font-bold text-accent mb-2">HADAL-001</div>
            <h3 className="font-bold mb-2">Improving Small Language Model Reasoning</h3>
            <p className="text-muted text-sm mb-4">
              Community Evaluation and Improvement of an Existing Open Model
            </p>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Contributors:</span>
                <span className="text-3xl font-bold text-accent">247</span>
              </div>
              <div>
                <span className="font-semibold">GPU Hours:</span>
                <span className="text-3xl font-bold text-accent">12,483</span>
              </div>
              <div>
                <span className="font-semibold">Progress:</span>
                <span className="text-3xl font-bold text-accent">67%</span>
              </div>
            </div>
            <Link href="/research/hadal-001">
              <span className="text-accent">View Run →</span>
            </Link>
          </div>
          
          <div className="bg-card rounded-lg p-6">
            <div className="text-3xl font-bold text-accent mb-2">HADAL-002</div>
            <h3 className="font-bold mb-2">Community Preference Dataset</h3>
            <p className="text-muted text-sm mb-4">
              Model comparison and preference evaluations
            </p>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Contributors:</span>
                <span className="text-3xl font-bold text-accent">128</span>
              </div>
              <div>
                <span className="font-semibold">Evaluations:</span>
                <span className="text-3xl font-bold text-accent">8,421</span>
              </div>
            </div>
            <Link href="/research/hadal-002">
              <span className="text-accent">View Run →</span>
            </Link>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Featured Research Runs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 h-full">
              <h3 className="font-bold mb-2">HADAL-003</h3>
              <p className="text-muted text-sm">Synthetic Data Generation</p>
            </div>
            <div className="bg-card rounded-lg p-4 h-full">
              <h3 className="font-bold mb-2">HADAL-004</h3>
              <p className="text-muted text-sm">Hyperparameter Optimization</p>
            </div>
            <div className="bg-card rounded-lg p-4 h-full">
              <h3 className="font-bold mb-2">HADAL-005</h3>
              <p className="text-muted text-sm">Benchmarks</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
