export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { AuthCallbackClient } from '@/components/pages/AuthCallbackClient';

export const metadata: Metadata = {
  title: 'Autenticando...',
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return <AuthCallbackClient />;
}
