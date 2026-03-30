'use client';

// Migrated from src/pages/CreateQuiz.tsx
// Changes: useNavigate/useLocation → useRouter/useSearchParams (next/navigation)
// Note: state.documentIds passed via query param instead of router state

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Brain,
  FileText,
  Coins,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { documentService } from '@/services/documentService';
import { quizService } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { cn, DIFFICULTY_LABELS } from '@/lib/utils';
import { QuestionType, DifficultyLevel, CreateQuizInput } from '@/types';

const QUESTION_TYPES: { value: QuestionType; label: string; cost: number; color: string }[] = [
  { value: 'true_false', label: 'Verdadero/Falso', cost: 1, color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  { value: 'single_choice', label: 'Opción múltiple', cost: 2, color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { value: 'fill_in_blank', label: 'Completar espacios', cost: 2, color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  { value: 'multiple_choice', label: 'Selección múltiple', cost: 3, color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  { value: 'short_answer', label: 'Respuesta corta', cost: 3, color: 'bg-pink-500/15 text-pink-400 border-pink-500/30' },
];

const DIFFICULTIES: { value: DifficultyLevel; label: string; multiplier: string }[] = [
  { value: 'easy', label: 'Fácil', multiplier: 'x1.0' },
  { value: 'medium', label: 'Media', multiplier: 'x1.2' },
  { value: 'hard', label: 'Difícil', multiplier: 'x1.5' },
];

export default function CreateQuiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useUiStore();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Support passing documentIds via query param (from DocumentDetail navigate)
  const preselectedDocId = searchParams?.get('documentIds');
  const preselectedDocs: string[] = preselectedDocId ? [preselectedDocId] : [];

  const [selectedDocs, setSelectedDocs] = useState<string[]>(preselectedDocs);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['single_choice']);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [includeExplanations, setIncludeExplanations] = useState(false);
  const [title, setTitle] = useState('');

  const { data: docsData } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentService.list(1, 50),
  });

  const processedDocs = (docsData?.data ?? []).filter((d: any) => d.status === 'processed');

  const { data: costEstimate } = useQuery({
    queryKey: ['quiz-cost', selectedTypes, questionCount, difficulty, includeExplanations],
    queryFn: () =>
      quizService.estimateCost({ questionTypes: selectedTypes, questionCount, difficulty, includeExplanations }),
    enabled: selectedTypes.length > 0 && questionCount > 0,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateQuizInput) => quizService.create(input),
    onSuccess: (quiz) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast.success('Quiz generado', `"${quiz.title}" está listo.`);
      router.push(`/quizzes/${quiz._id}`);
    },
    onError: (err: Error) => {
      toast.error('Error al generar quiz', err.message);
    },
  });

  const toggleDoc = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleType = (type: QuestionType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const canCreate =
    selectedDocs.length > 0 &&
    selectedTypes.length > 0 &&
    questionCount >= 1 &&
    questionCount <= 50;

  const estimatedCost = costEstimate?.total ?? 0;
  const hasEnoughCredits = (user?.credits ?? 0) >= estimatedCost;

  const handleCreate = () => {
    if (!canCreate) return;
    createMutation.mutate({
      documentIds: selectedDocs,
      title: title || undefined,
      questionTypes: selectedTypes,
      difficulty,
      questionCount,
      includeExplanations,
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Crear Quiz</h1>
        <p className="text-muted-foreground mt-1">
          Configura tu quiz y la IA generará preguntas desde tus documentos
        </p>
      </div>

      {/* Step 1: Select documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-400" />
            1. Selecciona documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processedDocs.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">
                No tienes documentos procesados.
              </p>
              <Button size="sm" variant="outline" onClick={() => router.push('/documents')}>
                Subir PDF
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {processedDocs.map((doc: any) => {
                const selected = selectedDocs.includes(doc._id);
                return (
                  <div
                    key={doc._id}
                    onClick={() => toggleDoc(doc._id)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                      selected
                        ? 'border-brand-500/40 bg-brand-500/10'
                        : 'border-white/[0.08] hover:border-white/15'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0',
                        selected ? 'border-brand-500 bg-brand-500' : 'border-white/20'
                      )}
                    >
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      {doc.pageCount && (
                        <p className="text-xs text-muted-foreground">{doc.pageCount} páginas</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Question types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            2. Tipos de preguntas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPES.map((t) => {
              const selected = selectedTypes.includes(t.value);
              return (
                <button
                  key={t.value}
                  onClick={() => toggleType(t.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                    selected ? t.color : 'border-white/[0.08] text-muted-foreground hover:border-white/20'
                  )}
                >
                  {selected && <Check className="h-3.5 w-3.5" />}
                  {t.label}
                  <span className="text-xs opacity-70">{t.cost}cr</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">3. Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Difficulty */}
          <div>
            <Label className="mb-2 block">Dificultad</Label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={cn(
                    'flex-1 py-2 rounded-lg border text-sm font-medium transition-all',
                    difficulty === d.value
                      ? 'border-brand-500/40 bg-brand-500/15 text-brand-400'
                      : 'border-white/[0.08] text-muted-foreground hover:border-white/20'
                  )}
                >
                  {d.label}
                  <span className="block text-xs opacity-70">{d.multiplier}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question count */}
          <div>
            <Label htmlFor="count" className="mb-2 block">
              Número de preguntas (1-50)
            </Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={50}
              value={questionCount}
              onChange={(e) => setQuestionCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-32"
            />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="mb-2 block">
              Título (opcional)
            </Label>
            <Input
              id="title"
              placeholder="Ej: Repaso Tema 3 - Biología"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>

          {/* Explanations */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.08]">
            <div>
              <p className="text-sm font-medium">Incluir explicaciones</p>
              <p className="text-xs text-muted-foreground">+1 crédito por pregunta</p>
            </div>
            <button
              onClick={() => setIncludeExplanations(!includeExplanations)}
              className={cn(
                'w-11 h-6 rounded-full border-2 transition-all relative',
                includeExplanations
                  ? 'bg-brand-500 border-brand-500'
                  : 'bg-muted border-white/20'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                  includeExplanations ? 'left-5' : 'left-0.5'
                )}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Cost summary & create */}
      <Card className={cn(!hasEnoughCredits && 'border-red-500/20 bg-red-500/5')}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold">Costo estimado</span>
            </div>
            <span className="text-2xl font-bold text-yellow-400">{estimatedCost} cr</span>
          </div>

          {costEstimate && (
            <div className="text-xs text-muted-foreground space-y-1 mb-4">
              <p>Base: {costEstimate.baseCost} cr · Dificultad x{costEstimate.difficultyMultiplier}</p>
              {costEstimate.explanationCost > 0 && (
                <p>Explicaciones: +{costEstimate.explanationCost} cr</p>
              )}
              <p>Saldo actual: <span className={hasEnoughCredits ? 'text-green-400' : 'text-red-400'}>{user?.credits} cr</span></p>
            </div>
          )}

          {!hasEnoughCredits && (
            <div className="flex items-center gap-2 text-sm text-red-400 mb-4">
              <AlertCircle className="h-4 w-4" />
              Créditos insuficientes.{' '}
              <button onClick={() => router.push('/credits')} className="underline">
                Recargar
              </button>
            </div>
          )}

          <Button
            className="w-full"
            variant="gradient"
            disabled={!canCreate || !hasEnoughCredits || createMutation.isPending}
            loading={createMutation.isPending}
            onClick={handleCreate}
          >
            {createMutation.isPending ? (
              'Generando quiz con IA...'
            ) : (
              <>
                Generar quiz · {estimatedCost} créditos
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {createMutation.isPending && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Esto puede tomar hasta 30 segundos...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
