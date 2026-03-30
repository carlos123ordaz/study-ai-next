'use client';

// Migrated from src/pages/ViewSummary.tsx
// Changes: useParams/useNavigate → useParams/useRouter (next/navigation)

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, BookOpen, Tag } from 'lucide-react';
import { summaryService } from '@/services/summaryService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function ViewSummary() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary', id],
    queryFn: () => summaryService.get(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/summaries')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{summary.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatDate(summary.createdAt)} · {summary.creditsUsed} créditos usados
          </p>
        </div>
      </div>

      {/* Overview */}
      {summary.content.overview && (
        <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-brand-400" />
            <span className="text-sm font-semibold text-brand-400 uppercase tracking-widest">
              Resumen general
            </span>
          </div>
          <p className="text-foreground/90 leading-relaxed">{summary.content.overview}</p>
        </div>
      )}

      {/* Sections */}
      {summary.content.sections.length > 0 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold">Secciones principales</h2>
          {summary.content.sections.map((section, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.08] bg-card p-6"
            >
              <h3 className="font-semibold mb-3 text-foreground">{section.heading}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Key terms */}
      {summary.content.keyTerms.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-purple-400" />
            <h2 className="text-lg font-bold">Términos clave</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {summary.content.keyTerms.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.08] bg-card p-4"
              >
                <div className="mb-1">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {item.term}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
