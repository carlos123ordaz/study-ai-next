import { PublicNav } from '@/components/layout/PublicNav';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      {children}
    </div>
  );
}
