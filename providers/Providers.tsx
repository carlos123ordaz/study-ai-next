'use client';

import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { getStoredToken } from '@/services/api';
import { Toaster } from '@/components/ui/toaster';

// Create QueryClient outside component to avoid re-creation on renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthRehydration() {
  const { setUser, setLoading, logout } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((user) => setUser(user))
      .catch(() => {
        // Token is invalid/expired — clear everything so middleware
        // doesn't keep redirecting back to protected routes
        logout();
      });
  }, [setUser, setLoading, logout]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthRehydration />
      {children}
      <Toaster />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
