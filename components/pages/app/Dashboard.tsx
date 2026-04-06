'use client';

// Migrated from src/pages/Dashboard.tsx
// Changes: useNavigate → useRouter, Link from react-router-dom → next/link

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  FileText, Brain, TrendingUp, Plus, ArrowRight, Coins, Clock, Award,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { documentService } from '@/services/documentService';
import { quizService } from '@/services/quizService';
import { creditService } from '@/services/creditService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeTime, getScoreBadgeColor } from '@/lib/utils';

function StatCard({
  icon: Icon, label, value, sub, iconColor, loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string | number; sub?: string;
  iconColor: string; loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1 truncate">{label}</p>
            {loading ? <Skeleton className="h-6 sm:h-8 w-16 sm:w-20" /> : <p className="text-xl sm:text-2xl font-bold">{value}</p>}
            {sub && <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>}
          </div>
          <div className={cn('rounded-xl p-2 sm:p-3 shrink-0', iconColor)}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter(); // ← replaced useNavigate

  const { data: docsData, isLoading: docsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentService.list(1, 3),
  });

  const { data: quizzesData, isLoading: quizzesLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizService.list(1, 3),
  });

  const { data: attemptsData, isLoading: attemptsLoading } = useQuery({
    queryKey: ['attempts'],
    queryFn: () => quizService.listAttempts(1, 5),
  });

  const { data: credits } = useQuery({
    queryKey: ['credits'],
    queryFn: () => creditService.getBalance(),
  });

  const docs = docsData?.data ?? [];
  const quizzes = quizzesData?.data ?? [];
  const attempts = attemptsData?.data ?? [];

  return (
    <div className="space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">
            Hola, {user?.name?.split(' ')[0] ?? 'estudiante'} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            ¿Qué vas a estudiar hoy?
          </p>
        </div>
        <Button
          className="bg-brand-500 hover:bg-brand-600 text-white hidden sm:flex"
          onClick={() => router.push('/quizzes/create')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo quiz
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <StatCard
          icon={FileText} label="Documentos"
          value={docsData?.total ?? 0}
          iconColor="bg-blue-500/15 text-blue-400"
          loading={docsLoading}
        />
        <StatCard
          icon={Brain} label="Quizzes"
          value={quizzesData?.total ?? 0}
          iconColor="bg-purple-500/15 text-purple-400"
          loading={quizzesLoading}
        />
        <StatCard
          icon={TrendingUp} label="Intentos"
          value={attemptsData?.total ?? 0}
          iconColor="bg-green-500/15 text-green-400"
          loading={attemptsLoading}
        />
        <StatCard
          icon={Coins} label="Créditos"
          value={credits ?? user?.credits ?? 0}
          iconColor="bg-yellow-500/15 text-yellow-400"
        />
      </div>

      {/* Recent documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Documentos recientes</h2>
          <Link href="/documents" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {docsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : docs.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Todavía no subiste ningún documento.</p>
              <Button size="sm" className="mt-4 bg-brand-500 hover:bg-brand-600 text-white" onClick={() => router.push('/documents')}>
                Subir PDF
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {docs.map((doc: any) => (
              <Link key={doc.id} href={`/documents/${doc.id}`}>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-white/[0.08] bg-card hover:border-white/[0.16] transition-colors">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(doc.createdAt)}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0 hidden sm:inline-flex">{doc.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent attempts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Intentos recientes</h2>
          <Link href="/quizzes" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Ver quizzes <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {attemptsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : attempts.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Award className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Todavía no hiciste ningún quiz.</p>
              <Button size="sm" className="mt-4 bg-brand-500 hover:bg-brand-600 text-white" onClick={() => router.push('/quizzes/create')}>
                Crear quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {attempts.map((a: any) => (
              <Link key={a.id} href={`/quizzes/results/${a.id}`}>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-white/[0.08] bg-card hover:border-white/[0.16] transition-colors">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                    <Brain className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.quiz?.title ?? 'Quiz'}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(a.createdAt)}
                    </p>
                  </div>
                  <Badge className={cn('text-xs shrink-0', getScoreBadgeColor(a.score))}>
                    {a.score}%
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
