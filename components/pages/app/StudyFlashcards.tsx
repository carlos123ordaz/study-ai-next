'use client';

// Migrated from src/pages/StudyFlashcards.tsx
// Changes: useParams/useNavigate → useParams/useRouter (next/navigation)

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2, ChevronLeft } from 'lucide-react';
import { flashcardService } from '@/services/flashcardService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function StudyFlashcards() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);

  const { data: set, isLoading } = useQuery({
    queryKey: ['flashcard-set', id],
    queryFn: () => flashcardService.get(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!set || set.cards.length === 0) return null;

  const cards = set.cards;
  const card = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setFinished(true);
      }
    }, 150);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setTimeout(() => setCurrentIndex((i) => i - 1), 150);
    }
  };

  const handleMarkKnown = () => {
    setKnown((prev) => new Set([...prev, currentIndex]));
    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="rounded-full bg-green-500/15 w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Repaso completado!</h2>
        <p className="text-muted-foreground mb-2">
          Revisaste las {cards.length} tarjetas.
        </p>
        <p className="text-muted-foreground mb-8">
          Marcaste{' '}
          <span className="text-green-400 font-semibold">{known.size}</span> de{' '}
          {cards.length} como aprendidas.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" />
            Repetir
          </Button>
          <Button variant="gradient" onClick={() => router.push('/flashcards')}>
            Volver a flashcards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/flashcards')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">{set.title}</h1>
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} / {cards.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="relative cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '260px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/[0.08] bg-card p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-xs text-brand-400 font-medium uppercase tracking-widest mb-4">
              Pregunta
            </p>
            <p className="text-xl font-semibold leading-relaxed">{card.front}</p>
            <p className="text-xs text-muted-foreground mt-6">
              Hacé clic para ver la respuesta
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 via-card to-card p-8 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-xs text-green-400 font-medium uppercase tracking-widest mb-4">
              Respuesta
            </p>
            <p className="text-lg leading-relaxed text-foreground">{card.back}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2 flex-1 justify-center">
          <Button
            variant="outline"
            className="flex-1 max-w-[160px] border-green-500/30 hover:bg-green-500/10 hover:text-green-400"
            onClick={handleMarkKnown}
          >
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            Ya la sé
          </Button>
          <Button variant="outline" className="flex-1 max-w-[160px]" onClick={handleNext}>
            Siguiente
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="ghost" size="icon" onClick={handleRestart}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Known count */}
      {known.size > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          <span className="text-green-400 font-medium">{known.size}</span> tarjetas marcadas como aprendidas
        </p>
      )}
    </div>
  );
}
