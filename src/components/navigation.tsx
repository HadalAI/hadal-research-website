import Link from 'next/link';
export function Navigation() {
  return (
    <nav className="fixed top-4 right-4 z-50 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2">
      <div className="flex space-x-4">
        <Link href="/" className="text-sm text-muted hover:text-accent">Home</Link>
        <Link href="/research" className="text-sm text-muted hover:text-accent">Research</Link>
        <Link href="/models" className="text-sm text-muted hover:text-accent">Models</Link>
        <Link href="/contribute" className="text-sm text-muted hover:text-accent">Contribute</Link>
      </div>
    </nav>
  );
}
