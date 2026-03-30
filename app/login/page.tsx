import type { Metadata } from 'next';
import { LoginClient } from '@/components/pages/LoginClient';

export const metadata: Metadata = {
  title: 'Ingresar a StudyAI',
  robots: { index: false, follow: false }, // Don't index auth pages
};

export default function LoginPage() {
  return <LoginClient />;
}
