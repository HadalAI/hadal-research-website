import Link from 'next/link';

export default function ContributePage() {
  return (
    <main className="min-h-screen bg-deep text-foreground font-sans">
      <div className="container mx-auto px-4 py-16">
        <nav className="mb-8">
          <Link href="/" className="text-accent font-medium hover:underline">
            ← Hadal Research
          </Link>
          <span className="mx-2">/</span>
          <span>Contribute</span>
        </nav>
        
        <h1 className="text-5xl font-bold mb-8 text-accent">
          Contribute to Hadal Research
        </h1>
        
        <p className="text-muted mb-8">
          Help build the future of AI by contributing your compute, data, or evaluation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">💻</div>
            <h3 className="font-bold mb-2">Compute</h3>
            <p className="text-muted text-sm mb-4">
              Share your GPU power to train and evaluate models.
            </p>
            
              <Link href="/contribute/compute" className="text-accent hover:underline">
                Learn how →
              </Link>
            
          </div>
          
          <div className="bg-card rounded-lg p-6 text-center">
            <div className="text-4xl text-accent mb-2">📊</div>
            <h3 className="font-bold mb-2">Data</h3>
            <p className="text-muted text-sm mb-4">
              Contribute datasets and annotations to improve model learning.
            </p>
            
              <Link href="/contribute/data" className="text-accent hover:underline">
                Learn how →
              </Link>
            
          </div>
          
          <div className="bg-card rounded-lg p-6 text-center">
            <div className="text-4xl text-accent mb-2">🧪</div>
            <h3 className="font-bold mb-2">Evaluation</h3>
            <p className="text-muted text-sm mb-4">
              Help evaluate model outputs and improve quality.
            </p>
            
              <Link href="/contribute/eval" className="text-accent hover:underline">
                Learn how →
              </Link>
            
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-surface/50">
          <h2 className="text-2xl font-bold mb-4">Your Contribution Counts</h2>
          <p className="text-muted mb-6">
            Every contribution, whether GPU hours or evaluation feedback, helps
            build better open AI models that benefit the entire community.
          </p>
          <div className="grid grid-cols-2 gap-4">
            
              <Link href="/login">Sign In</Link>
            
            <Button asChild variant="outline">
              <Link href="/signup">Sign Up</Link>
            
          </div>
        </div>
      </div>
    </main>
  );
}
