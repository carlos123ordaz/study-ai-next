'use client';

// Migrated from src/pages/DocumentDetail.tsx
// Changes: useParams/useNavigate → useParams/useRouter (next/navigation)

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, FileText, Brain, Calendar, Hash, Layers, Zap, BookOpen } from 'lucide-react';
import { documentService } from '@/services/documentService';
import { flashcardService } from '@/services/flashcardService';
import { summaryService } from '@/services/summaryService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { formatFileSize, formatDate } from '@/lib/utils';

export default function DocumentDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { toast } = useUiStore();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const flashcardMutation = useMutation({
    mutationFn: () => flashcardService.create(id!),
    onSuccess: (set) => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast.success('Flashcards generados', `"${set.title}" está listo.`);
      router.push(`/flashcards/${set._id}`);
    },
    onError: (err: Error) => toast.error('Error al generar flashcards', err.message),
  });

  const summaryMutation = useMutation({
    mutationFn: () => summaryService.create(id!),
    onSuccess: (summary) => {
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast.success('Resumen generado', `"${summary.title}" está listo.`);
      router.push(`/summaries/${summary._id}`);
    },
    onError: (err: Error) => toast.error('Error al generar resumen', err.message),
  });

  const { data: doc, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.get(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!doc) return null;

  const statusConfig = {
    uploaded: { label: 'Subido', variant: 'info' as const },
    processing: { label: 'Procesando', variant: 'warning' as const },
    processed: { label: 'Procesado', variant: 'success' as const },
    failed: { label: 'Error', variant: 'destructive' as const },
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/documents')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{doc.name}</h1>
          <p className="text-muted-foreground text-sm">{doc.originalName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Información del documento</CardTitle>
            <Badge variant={statusConfig[doc.status].variant}>
              {statusConfig[doc.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <InfoRow icon={FileText} label="Tamaño" value={formatFileSize(doc.size)} />
            <InfoRow
              icon={Hash}
              label="Páginas"
              value={doc.pageCount ? `${doc.pageCount} páginas` : '—'}
            />
            <InfoRow
              icon={Layers}
              label="Chunks de texto"
              value={doc.chunkCount ? `${doc.chunkCount} bloques` : '—'}
            />
            <InfoRow
              icon={Calendar}
              label="Subido"
              value={formatDate(doc.createdAt)}
            />
          </div>

          {doc.processingCreditsUsed > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.08]">
              <p className="text-sm text-muted-foreground">
                Créditos usados en procesamiento:{' '}
                <span className="text-foreground font-medium">
                  {doc.processingCreditsUsed}
                </span>
              </p>
            </div>
          )}

          {doc.status === 'failed' && doc.errorMessage && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{doc.errorMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {doc.status === 'processed' && (
        <div>
          <h2 className="text-base font-semibold mb-3">Generar con IA</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Button
              variant="gradient"
              className="justify-start"
              onClick={() =>
                router.push(`/quizzes/create?documentIds=${doc._id}`)
              }
            >
              <Brain className="h-4 w-4" />
              Quiz · 20–50 cr
            </Button>
            <Button
              variant="outline"
              className="justify-start border-brand-500/30 hover:border-brand-500/50"
              disabled={flashcardMutation.isPending || (user?.credits ?? 0) < 10}
              loading={flashcardMutation.isPending}
              onClick={() => flashcardMutation.mutate()}
            >
              <Zap className="h-4 w-4 text-brand-400" />
              {flashcardMutation.isPending ? 'Generando...' : 'Flashcards · 10 cr'}
            </Button>
            <Button
              variant="outline"
              className="justify-start border-purple-500/30 hover:border-purple-500/50"
              disabled={summaryMutation.isPending || (user?.credits ?? 0) < 15}
              loading={summaryMutation.isPending}
              onClick={() => summaryMutation.mutate()}
            >
              <BookOpen className="h-4 w-4 text-purple-400" />
              {summaryMutation.isPending ? 'Generando...' : 'Resumen · 15 cr'}
            </Button>
          </div>
          {(flashcardMutation.isPending || summaryMutation.isPending) && (
            <p className="text-xs text-muted-foreground mt-2">
              Esto puede tomar hasta 30 segundos...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
