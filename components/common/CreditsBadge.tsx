'use client';

import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreditsBalance } from '@/hooks/useCreditsBalance';

interface CreditsBadgeProps {
  className?: string;
  showLabel?: boolean;
}

export function CreditsBadge({ className, showLabel = false }: CreditsBadgeProps) {
  const { credits } = useCreditsBalance();

  return (
    <div className={cn('flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5', className)}>
      <Coins className="h-3.5 w-3.5 text-yellow-400" />
      <span className="text-sm font-semibold text-yellow-400">{credits.toLocaleString()}</span>
      {showLabel && <span className="text-xs text-yellow-400/70">créditos</span>}
    </div>
  );
}
