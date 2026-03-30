'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

export function LoginClient() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const handleGoogleLogin = async () => {
    const url = await authService.getGoogleLoginUrl();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="rounded-xl bg-brand-500 p-2">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              StudyAI
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Bienvenido</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Ingresá para empezar a estudiar con IA
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl border border-white/[0.08] bg-card">
          <Button
            size="lg"
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium gap-3"
            onClick={handleGoogleLogin}
          >
            <Chrome className="h-5 w-5" />
            Continuar con Google
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Al continuar aceptás nuestros{' '}
            <span className="underline cursor-pointer hover:text-foreground">
              Términos de servicio
            </span>{' '}
            y{' '}
            <span className="underline cursor-pointer hover:text-foreground">
              Política de privacidad
            </span>
            .
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿Primera vez?{' '}
          <span className="text-brand-400">
            Tu cuenta se crea automáticamente al ingresar.
          </span>
        </p>
      </div>
    </div>
  );
}
