import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';

// All private pages: blocked from indexing
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
