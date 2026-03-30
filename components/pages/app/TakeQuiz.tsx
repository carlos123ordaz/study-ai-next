'use client';

// Migrated from src/pages/TakeQuiz.tsx
// Changes: useParams/useNavigate → useParams/useRouter (next/navigation)

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Brain,
  CheckSquare,
  Send,
} from 'lucide-react';
import { quizService } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { useUiStore } from '@/store/uiStore';
import { cn, QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/utils';
import { Question, UserAnswer } from '@/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function QuestionCard({
  question,
  answer,
  onAnswer,
}: {
  question: Question;
  answer: UserAnswer | undefined;
  onAnswer: (questionId: string, value: string | string[]) => void;
}) {
  const currentAnswer = answer?.answer;

  if (question.type === 'single_choice') {
    return (
      <div className="space-y-3">
        {question.options?.map((opt) => {
          const selected =
            Array.isArray(currentAnswer) ? currentAnswer[0] === opt.id : currentAnswer === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onAnswer(question._id, opt.id)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all',
                selected
                  ? 'border-brand-500/50 bg-brand-500/15 text-foreground'
                  : 'border-white/[0.08] hover:border-white/20 hover:bg-accent/50'
              )}
            >
              <span className="font-medium text-brand-400 mr-3">{opt.id.toUpperCase()}.</span>
              {opt.text}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === 'multiple_choice') {
    const selected = Array.isArray(currentAnswer) ? currentAnswer : currentAnswer ? [currentAnswer] : [];
    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Selecciona todas las correctas</p>
        {question.options?.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => {
                const next = isSelected
                  ? selected.filter((s) => s !== opt.id)
                  : [...selected, opt.id];
                onAnswer(question._id, next);
              }}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3',
                isSelected
                  ? 'border-brand-500/50 bg-brand-500/15'
                  : 'border-white/[0.08] hover:border-white/20 hover:bg-accent/50'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0',
                  isSelected ? 'border-brand-500 bg-brand-500' : 'border-white/20'
                )}
              >
                {isSelected && <CheckSquare className="h-3 w-3 text-white" />}
              </div>
              <span className="font-medium text-brand-400 mr-1">{opt.id.toUpperCase()}.</span>
              {opt.text}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === 'true_false') {
    const val = Array.isArray(currentAnswer) ? currentAnswer[0] : currentAnswer;
    return (
      <div className="flex gap-4">
        {['true', 'false'].map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(question._id, option)}
            className={cn(
              'flex-1 py-4 rounded-xl border text-lg font-bold transition-all',
              val === option
                ? option === 'true'
                  ? 'border-green-500/50 bg-green-500/15 text-green-400'
                  : 'border-red-500/50 bg-red-500/15 text-red-400'
                : 'border-white/[0.08] hover:border-white/20 hover:bg-accent/50'
            )}
          >
            {option === 'true' ? '✓ Verdadero' : '✗ Falso'}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === 'fill_in_blank' || question.type === 'short_answer') {
    const val = Array.isArray(currentAnswer) ? currentAnswer[0] : currentAnswer ?? '';
    return (
      <div>
        {question.type === 'fill_in_blank' && (
          <p className="text-sm text-muted-foreground mb-3">Completa el espacio en blanco</p>
        )}
        <Input
          value={val}
          onChange={(e) => onAnswer(question._id, e.target.value)}
          placeholder={
            question.type === 'short_answer'
              ? 'Escribe tu respuesta aquí...'
              : 'Respuesta...'
          }
          className={question.type === 'short_answer' ? 'h-20' : ''}
        />
      </div>
    );
  }

  return null;
}

export default function TakeQuiz() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { toast } = useUiStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [startTime]);

  const { data, isLoading } = useQuery({
    queryKey: ['quiz-take', id],
    queryFn: () => quizService.get(id!),
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      quizService.submitAttempt(id!, answers, elapsed),
    onSuccess: (attempt) => {
      clearInterval(timerRef.current);
      toast.success('Quiz enviado', `Resultado: ${attempt.score}%`);
      router.push(`/quizzes/results/${attempt._id}`);
    },
    onError: (err: Error) => {
      toast.error('Error al enviar', err.message);
    },
  });

  if (isLoading || !data) return <PageLoader />;

  const { quiz, questions } = data;
  const currentQuestion = questions[currentIdx];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion._id);
  const answeredCount = answers.filter((a) => {
    const ans = a.answer;
    return Array.isArray(ans) ? ans.length > 0 : (ans ?? '').toString().trim().length > 0;
  }).length;

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, answer: value };
        return updated;
      }
      return [...prev, { questionId, answer: value }];
    });
  };

  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold truncate">{quiz.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="brand">{DIFFICULTY_LABELS[quiz.difficulty]}</Badge>
            <span className="text-xs text-muted-foreground">
              {answeredCount}/{questions.length} respondidas
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm tabular-nums">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Pregunta {currentIdx + 1} de {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3 text-xs">
                {QUESTION_TYPE_LABELS[currentQuestion.type]}
              </Badge>
              <p className="text-base font-medium leading-relaxed">{currentQuestion.text}</p>
            </div>
            <span className="text-2xl font-bold text-muted-foreground/30 tabular-nums shrink-0">
              {currentIdx + 1}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <QuestionCard
            question={currentQuestion}
            answer={currentAnswer}
            onAnswer={handleAnswer}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex-1 flex justify-center gap-1 flex-wrap">
          {questions.map((_, idx) => {
            const ans = answers.find((a) => a.questionId === questions[idx]._id);
            const hasAnswer = ans
              ? Array.isArray(ans.answer)
                ? ans.answer.length > 0
                : (ans.answer ?? '').toString().trim().length > 0
              : false;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={cn(
                  'w-7 h-7 rounded-md text-xs font-medium transition-all',
                  idx === currentIdx
                    ? 'bg-brand-500 text-white'
                    : hasAnswer
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {currentIdx < questions.length - 1 ? (
          <Button onClick={() => setCurrentIdx((i) => i + 1)}>
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="gradient"
            onClick={() => submitMutation.mutate()}
            loading={submitMutation.isPending}
            disabled={answeredCount === 0}
          >
            <Send className="h-4 w-4" />
            Enviar
          </Button>
        )}
      </div>

      {/* Quick submit if all answered */}
      {answeredCount === questions.length && currentIdx < questions.length - 1 && (
        <Button
          variant="gradient"
          className="w-full"
          onClick={() => submitMutation.mutate()}
          loading={submitMutation.isPending}
        >
          <Brain className="h-4 w-4" />
          Todas respondidas · Enviar quiz
        </Button>
      )}
    </div>
  );
}
