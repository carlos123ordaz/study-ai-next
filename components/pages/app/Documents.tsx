'use client';

// Migrated from src/pages/Documents.tsx
// Changes: useNavigate → useRouter, removed react-router-dom imports

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';
import { documentService } from '@/services/documentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { cn, formatFileSize, formatRelativeTime } from '@/lib/utils';
import { StudyDocument } from '@/types';

function StatusBadge({ status }: { status: StudyDocument['status'] }) {
  const config = {
    uploaded: { label: 'Subido', variant: 'info' as const, icon: Clock },
    processing: { label: 'Procesando', variant: 'warning' as const, icon: Loader2 },
    processed: { label: 'Listo', variant: 'success' as const, icon: CheckCircle2 },
    failed: { label: 'Error', variant: 'destructive' as const, icon: AlertCircle },
  };

  const { label, variant, icon: Icon } = config[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className={cn('h-3 w-3', status === 'processing' && 'animate-spin')} />
      {label}
    </Badge>
  );
}

function UploadZone({ onUpload }: { onUpload: (file: File) => void }) {
  const { toast } = useUiStore();

  const onDrop = useCallback(
    (accepted: File[], rejected: unknown[]) => {
      if (rejected && (rejected as unknown[]).length > 0) {
        toast.error('Archivo inválido', 'Solo se permiten PDFs de hasta 20MB.');
        return;
      }
      if (accepted.length > 0) {
        onUpload(accepted[0]);
      }
    },
    [onUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-xl p-6 sm:p-10 text-center cursor-pointer transition-all',
        isDragActive
          ? 'border-brand-500 bg-brand-500/10'
          : 'border-white/[0.12] hover:border-white/25 hover:bg-accent/50'
      )}
    >
      <input {...getInputProps()} />
      <div className="rounded-full bg-brand-500/15 w-14 h-14 flex items-center justify-center mx-auto mb-4">
        <Upload className="h-6 w-6 text-brand-400" />
      </div>
      <p className="text-base font-medium mb-1">
        {isDragActive ? 'Suelta el PDF aquí' : (
          <>
            <span className="hidden sm:inline">Arrastra un PDF o haz clic para seleccionar</span>
            <span className="sm:hidden">Toca para seleccionar un PDF</span>
          </>
        )}
      </p>
      <p className="text-sm text-muted-foreground">Solo PDFs · Máximo 20MB</p>
    </div>
  );
}

export default function Documents() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useUiStore();
  const updateCredits = useAuthStore((s) => s.updateCredits);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentService.list(),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => documentService.upload(file),
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      if (doc.status === 'processed') {
        toast.success(
          'Documento procesado',
          `"${doc.name}" está listo. Se usaron ${doc.processingCreditsUsed} créditos.`
        );
      } else if (doc.status === 'failed') {
        toast.error('Error al procesar', doc.errorMessage ?? 'Procesamiento fallido.');
      } else {
        toast.success('Documento subido', `"${doc.name}" fue subido correctamente.`);
      }
    },
    onError: (err: Error) => {
      toast.error('Error al subir', err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Documento eliminado');
      setDeletingId(null);
    },
    onError: (err: Error) => {
      toast.error('Error al eliminar', err.message);
      setDeletingId(null);
    },
  });

  const documents = data?.data ?? [];

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold">Documentos</h1>
        <p className="text-muted-foreground mt-1">
          Sube PDFs para generar quizzes inteligentes
        </p>
      </div>

      <UploadZone onUpload={(f) => uploadMutation.mutate(f)} />

      {uploadMutation.isPending && (
        <Card className="border-brand-500/20 bg-brand-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-brand-400" />
            <div>
              <p className="text-sm font-medium">Procesando documento...</p>
              <p className="text-xs text-muted-foreground">
                Extrayendo texto y generando chunks. Esto puede tomar hasta 1 minuto.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Sin documentos aún"
          description="Sube tu primer PDF para comenzar a generar quizzes con IA."
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{data?.total} documento(s)</p>
          {documents.map((doc: any) => (
            <Card
              key={doc._id}
              className="hover:border-white/[0.15] transition-colors cursor-pointer"
              onClick={() => router.push(`/documents/${doc._id}`)}
            >
              <CardContent className="p-4 overflow-hidden">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-lg bg-blue-500/15 p-2.5 shrink-0">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-medium truncate max-w-[180px] sm:max-w-none pt-0.5">{doc.name}</p>
                      <div className="flex items-center gap-1 shrink-0">
                        <StatusBadge status={doc.status} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hidden sm:flex h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/documents/${doc._id}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(doc._id);
                            deleteMutation.mutate(doc._id);
                          }}
                          disabled={deletingId === doc._id}
                        >
                          {deletingId === doc._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      <span>{formatFileSize(doc.size)}</span>
                      {doc.pageCount && (
                        <>
                          <span>·</span>
                          <span>{doc.pageCount} páginas</span>
                        </>
                      )}
                      {doc.chunkCount && (
                        <span className="hidden sm:inline">
                          <span className="mx-1">·</span>
                          {doc.chunkCount} chunks
                        </span>
                      )}
                      <span>·</span>
                      <span>{formatRelativeTime(doc.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {doc.status === 'failed' && doc.errorMessage && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-red-400 bg-red-500/10 rounded-lg p-2">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>{doc.errorMessage}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
