'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { setStoredToken } from '@/services/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    setStoredToken(token);
    setToken(token);

    authService
      .getMe()
      .then((user) => {
        setUser(user);
        router.replace('/dashboard');
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [searchParams, router, setUser, setToken]);

  return <LoadingSpinner />;
}
