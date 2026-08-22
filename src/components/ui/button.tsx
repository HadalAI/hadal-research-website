import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  asChild = false,
  href,
  className,
  onClick 
}: 
{
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  const variants = {
    default: 'bg-deep text-accent hover:bg-accent/90 border border-accent',
    outline: 'border border-deep text-deep hover:bg-deep',
    secondary: 'bg-surface text-muted hover:bg-surface/80',
  };
  const sizes = {
    default: 'px-6 py-3',
    sm: 'px-4 py-2 text-sm',
    lg: 'px-8 py-4',
  };
  
  const cls = cn(base, variants[variant], sizes[size], className);
  
  if (asChild && href) {
    return <Link href={href} className={cls}>{children}</Link>;
  }
  
  return <button className={cls} onClick={onClick}>{children}</button>;
}
