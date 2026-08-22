import Link from 'next/link';

export default function ModelsPage() {
  return (
    <main className="min-h-screen bg-deep text-foreground font-sans">
      <div className="container mx-auto px-4 py-16">
        <nav className="mb-8">
          <Link href="/" className="text-accent font-medium hover:underline">
            ← Hadal Research
          </Link>
          <span className="mx-2">/</span>
          <span>Models</span>
        </nav>
        
        <h1 className="text-5xl font-bold mb-8 text-accent">
          Model Releases
        </h1>
        
        <p className="text-muted mb-8">
          Major model releases built with the Hadal community.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg p-6 hover:transform hover:transition-all hover:scale-105 hover:bg-surface/50 transition-all">
            <div className="text-3xl font-bold text-accent mb-2">HADAL-1</div>
            <h3 className="font-bold mb-2">Built with the Hadal community</h3>
            <p className="text-muted text-sm mb-3">
              12,847 contributors · 847,293 GPU hours · 14 research runs
            </p>
            <ul className="text-muted text-sm space-y-1">
              <li>4.2M evaluations</li>
              <li>83 datasets</li>
              <li>4.2 rating</li>
            </ul>
            <Link href="/models/hadal-1">
              <div className="mt-4">
                <span className="text-accent">View Model →</span>
                <svg className="inline-block ml-1 w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>
          </div>
          
          <div className="bg-card rounded-lg p-6 hover:transform hover:transition-all hover:scale-105 hover:bg-surface/50 transition-all">
            <div className="text-3xl font-bold text-accent mb-2">HADAL-2</div>
            <h3 className="font-bold mb-2">Next Generation Model</h3>
            <p className="text-muted text-sm mb-3">Coming soon</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 hover:transform hover:transition-all hover:scale-105 hover:bg-surface/50 transition-all">
            <div className="text-3xl font-bold text-accent mb-2">HADAL-3</div>
            <h3 className="font-bold mb-2">Open Source Release</h3>
            <p className="text-muted text-sm mb-3">License: MIT</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Contribute to a Model</h2>
          <p className="text-muted mb-4">
            Your contributions help build better open models.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button asChild>
              <Link href="/contribute">Share Compute</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contribute/data">Contribute Data</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
