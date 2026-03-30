'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Brain, Zap, BookOpen as SummaryIcon,
  Coins, User, LogOut, Menu, X, BookOpen,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { authService } from '@/services/authService';
import { CreditsBadge } from '@/components/common/CreditsBadge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/common/Avatar';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/documents', icon: FileText, label: 'Documentos' },
  { to: '/quizzes', icon: Brain, label: 'Quizzes' },
  { to: '/flashcards', icon: Zap, label: 'Flashcards' },
  { to: '/summaries', icon: SummaryIcon, label: 'Resúmenes' },
  { to: '/credits', icon: Coins, label: 'Créditos' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { toast } = useUiStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      router.push('/');
      toast.success('Sesión cerrada');
    }
  };

  const NavLinks = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = pathname.startsWith(to);
        return (
          <Link
            key={to}
            href={to}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <div className="flex flex-col h-full bg-card border-r border-white/[0.08]">
          <div className="flex items-center gap-2.5 px-6 h-16 border-b border-white/[0.08]">
            <div className="rounded-lg bg-brand-500 p-1.5">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              StudyAI
            </span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            <NavLinks />
          </nav>

          <div className="p-4 border-t border-white/[0.08]">
            <CreditsBadge className="w-full mb-3" showLabel />
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={user?.avatar} name={user?.name ?? ''} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — Mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-white/[0.08] transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-brand-500 p-1.5">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-brand-400">StudyAI</span>
          </div>
          <button onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1">
          <NavLinks onItemClick={() => setMobileOpen(false)} />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 md:pl-64">
        <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-white/[0.08] bg-card sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-400" />
            <span className="font-bold text-brand-400">StudyAI</span>
          </div>
          <CreditsBadge />
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
