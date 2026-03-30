'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-4' };

export function LoadingSpinner({ className, size = 'md', fullPage }: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('animate-spin rounded-full border-brand-500 border-t-transparent', sizes[size], className)} />
  );
  if (fullPage) return <div className="flex items-center justify-center min-h-screen">{spinner}</div>;
  return spinner;
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground text-sm animate-pulse">Cargando...</p>
    </div>
  );
}

// Default export for auth callback use
export default function LoadingSpinnerPage() {
  return <LoadingSpinner fullPage />;
}
