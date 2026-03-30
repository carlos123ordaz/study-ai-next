'use client';

// Migrated from src/pages/Flashcards.tsx
// Changes: useNavigate → useRouter (next/navigation)

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Zap, Trash2, Plus, Calendar } from 'lucide-react';
import { flashcardService } from '@/services/flashcardService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { useUiStore } from '@/store/uiStore';
import { formatDate } from '@/lib/utils';

export default function Flashcards() {
  const router = useRouter();
  const { toast } = useUiStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['flashcards'],
    queryFn: () => flashcardService.list(1, 50),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => flashcardService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      toast.success('Eliminado', 'Set de flashcards eliminado');
    },
    onError: (err: Error) => toast.error('Error', err.message),
  });

  const sets = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-1">
            Tus sets de tarjetas generadas con IA
          </p>
        </div>
        <Button variant="gradient" onClick={() => router.push('/documents')} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nuevo set
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : sets.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No tenés flashcards todavía"
          description="Generá tu primer set desde cualquier documento procesado."
          action={{ label: 'Ir a documentos', onClick: () => router.push('/documents') }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(sets as any[]).map((set: any) => (
            <Card
              key={set._id}
              className="hover:border-brand-500/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
              onClick={() => router.push(`/flashcards/${set._id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-xl bg-brand-500/15 p-2.5">
                    <Zap className="h-5 w-5 text-brand-400" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(set._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{set.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {set.cardCount} tarjetas
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(set.createdAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
