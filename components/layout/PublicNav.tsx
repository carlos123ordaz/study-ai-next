'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/features', label: 'Funcionalidades' },
  { href: '/pricing', label: 'Precios' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
];

export function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="rounded-lg bg-brand-500 p-1.5">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
            StudyAI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                pathname === href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Ingresar</Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-white">
              Empezar gratis
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-background px-4 py-4 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full">Ingresar</Button>
            </Link>
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full bg-brand-500 hover:bg-brand-600 text-white">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
