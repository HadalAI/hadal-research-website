import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ContributePage() {
  const ways = [
    {
      icon: '💻',
      title: 'Compute',
      desc: 'Share your GPU power to train and evaluate models.',
      href: '/contribute',
    },
    {
      icon: '📊',
      title: 'Data',
      desc: 'Contribute datasets and annotations to improve model learning.',
      href: '/contribute',
    },
    {
      icon: '🧪',
      title: 'Evaluation',
      desc: 'Help evaluate model outputs and improve quality.',
      href: '/contribute',
    },
  ];
  return (
    <main className="min-h-screen bg-deep text-foreground font-sans">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8 text-accent">
          Contribute to Hadal Research
        </h1>
        <p className="text-muted mb-8">
          Help build the future of AI by contributing your compute, data, or evaluation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {ways.map((w) => (
            <div key={w.title} className="bg-card rounded-lg p-6 text-center">
              <div className="text-4xl text-accent mb-2">{w.icon}</div>
              <h3 className="font-bold mb-2">{w.title}</h3>
              <p className="text-muted text-sm mb-4">{w.desc}</p>
              <Link href={w.href} className="text-accent hover:underline">
                Learn how →
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-surface/50">
          <h2 className="text-2xl font-bold mb-4">Your Contribution Counts</h2>
          <p className="text-muted mb-6">
            Every contribution, whether GPU hours or evaluation feedback, helps
            build better open AI models that benefit the entire community.
          </p>
          <Button asChild href="/research">
            <span>See Active Research</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
