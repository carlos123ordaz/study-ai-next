'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { creditService } from '@/services/creditService';
import { useAuthStore } from '@/store/authStore';

export function useCreditsBalance() {
  const updateCredits = useAuthStore((s) => s.updateCredits);
  const storeCredits = useAuthStore((s) => s.user?.credits ?? 0);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading } = useQuery({
    queryKey: ['credits'],
    queryFn: () => creditService.getBalance(),
    staleTime: 30_000,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data !== undefined) updateCredits(data);
  }, [data, updateCredits]);

  return { credits: data ?? storeCredits, isLoading };
}
