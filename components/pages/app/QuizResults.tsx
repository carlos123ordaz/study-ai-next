'use client';

// Migrated from src/pages/QuizResults.tsx
// Changes: useParams/useNavigate → useParams/useRouter (next/navigation)

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Brain,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { quizService } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { cn, QUESTION_TYPE_LABELS, getScoreBadgeColor, formatDate } from '@/lib/utils';
import { Question, AnswerResult } from '@/types';

function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 80 ? 'stroke-green-400' : score >= 60 ? 'stroke-yellow-400' : 'stroke-red-400';
  const r = 45;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}%</span>
      </div>
    </div>
  );
}

function QuestionReview({
  question,
  answerResult,
}: {
  question: Question;
  answerResult?: AnswerResult;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!answerResult) return null;

  const { isCorrect, userAnswer, isPartiallyCorrect } = answerResult;

  const getAnswerText = (answer: string | string[]): string => {
    if (Array.isArray(answer)) {
      if (question.options) {
        return answer
          .map((a) => question.options!.find((o) => o.id === a)?.text ?? a)
          .join(', ');
      }
      return answer.join(', ');
    }
    if (question.options) {
      return question.options.find((o) => o.id === answer)?.text ?? answer;
    }
    return answer;
  };

  const getCorrectText = (): string => {
    if (!question.correctAnswer) return '—';
    return getAnswerText(question.correctAnswer);
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all',
        isCorrect
          ? 'border-green-500/20 bg-green-500/5'
          : isPartiallyCorrect
          ? 'border-yellow-500/20 bg-yellow-500/5'
          : 'border-red-500/20 bg-red-500/5'
      )}
    >
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {isCorrect ? (
          <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">
              {QUESTION_TYPE_LABELS[question.type]}
            </Badge>
          </div>
          <p className="text-sm">{question.text}</p>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground shrink-0 transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Tu respuesta:</span>
            <span
              className={cn(
                'font-medium',
                isCorrect ? 'text-green-400' : 'text-red-400'
              )}
            >
              {getAnswerText(userAnswer) || '(sin respuesta)'}
            </span>
          </div>
          {!isCorrect && (
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Respuesta correcta:</span>
              <span className="font-medium text-green-400">{getCorrectText()}</span>
            </div>
          )}
          {question.explanation && (
            <div className="p-3 rounded-lg bg-muted/50">
              <span className="text-xs text-muted-foreground block mb-1">Explicación:</span>
              <p className="text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="text-center">
      <p className={cn('text-xl font-bold', color)}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default function QuizResults() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['attempt', id],
    queryFn: () => quizService.getAttempt(id!),
    enabled: !!id,
  });

  if (isLoading || !data) return <PageLoader />;

  const { attempt, quiz, questions } = data;
  const scoreLabel =
    attempt.score >= 90
      ? '¡Excelente!'
      : attempt.score >= 70
      ? '¡Buen trabajo!'
      : attempt.score >= 50
      ? 'Puedes mejorar'
      : 'Sigue practicando';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/quizzes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Resultados</h1>
          <p className="text-muted-foreground text-sm">{quiz.title}</p>
        </div>
      </div>

      {/* Score card */}
      <Card className={cn(getScoreBadgeColor(attempt.score).replace('text-', 'border-').split(' ')[0])}>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-4">
            <ScoreCircle score={attempt.score} />
            <div className="text-center">
              <p className="text-xl font-bold">{scoreLabel}</p>
              <p className="text-muted-foreground text-sm mt-1">
                {attempt.correctCount} de {attempt.totalQuestions} correctas
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
              <Stat label="Correctas" value={attempt.correctCount} color="text-green-400" />
              <Stat
                label="Incorrectas"
                value={attempt.totalQuestions - attempt.correctCount}
                color="text-red-400"
              />
              <Stat
                label="Tiempo"
                value={
                  attempt.timeSpentSeconds
                    ? `${Math.floor(attempt.timeSpentSeconds / 60)}m ${attempt.timeSpentSeconds % 60}s`
                    : '—'
                }
                color="text-blue-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="gradient"
          onClick={() =>
            router.push(`/quizzes/create?documentIds=${quiz.documentIds?.[0] ?? ''}`)
          }
        >
          <RotateCcw className="h-4 w-4" />
          Nuevo quiz
        </Button>
        <Button variant="outline" onClick={() => router.push(`/quizzes/${quiz._id}`)}>
          <Brain className="h-4 w-4" />
          Reintentar quiz
        </Button>
      </div>

      {/* Question review */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Revisión de preguntas</h2>
        <div className="space-y-3">
          {questions.map((question) => {
            const result = attempt.answers.find(
              (a) => a.questionId.toString() === question._id.toString()
            );
            return (
              <QuestionReview
                key={question._id}
                question={question}
                answerResult={result}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
