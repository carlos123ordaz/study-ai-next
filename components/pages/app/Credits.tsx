'use client';

// Migrated from src/pages/Credits.tsx
// Changes: useNavigate → useRouter (next/navigation); no router.push calls needed here

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Coins,
  Zap,
  Star,
  Sparkles,
  FileText,
  Brain,
  Gift,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { creditService } from '@/services/creditService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUiStore } from '@/store/uiStore';
import { useCreditsBalance } from '@/hooks/useCreditsBalance';
import { cn } from '@/lib/utils';
import { CreditPackage } from '@/types';

const PROVIDER_LABELS: Record<string, string> = {
  mercadopago: 'MercadoPago',
  paypal: 'PayPal',
  mock: 'Demo',
};

function PackageCard({
  pkg,
  index,
  onBuy,
  loading,
}: {
  pkg: CreditPackage;
  index: number;
  onBuy: (idx: number) => void;
  loading: boolean;
}) {
  const isPopular = index === 1;
  const pricePerCredit = pkg.priceUsd / pkg.credits;
  const showSavings = index > 0;

  return (
    <div
      className={cn(
        'group relative rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300',
        'hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-1',
        isPopular
          ? 'border-brand-500/40 bg-gradient-to-b from-brand-500/10 via-brand-500/5 to-transparent ring-1 ring-brand-500/20'
          : 'border-white/[0.08] hover:border-white/[0.15]'
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="brand" className="flex items-center gap-1 px-3 py-1 shadow-lg shadow-brand-500/20">
            <Star className="h-3 w-3 fill-current" />
            Mas popular
          </Badge>
        </div>
      )}

      <div>
        <p className="text-lg font-bold">{pkg.label}</p>
        <div className="flex items-baseline gap-1.5 mt-2">
          <Coins className="h-5 w-5 text-yellow-400 self-center" />
          <span className="text-3xl font-bold text-yellow-400">
            {pkg.credits.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm">creditos</span>
        </div>
      </div>

      <div className="flex-1" />

      <div>
        <div className="text-2xl font-bold">${pkg.priceUsd} USD</div>
        {showSavings && (
          <p className="text-xs text-green-400 mt-0.5">
            ${pricePerCredit.toFixed(3)}/credito
          </p>
        )}
      </div>

      <Button
        variant={isPopular ? 'gradient' : 'outline'}
        className={cn(
          'w-full',
          isPopular && 'shadow-lg shadow-brand-500/20'
        )}
        onClick={() => onBuy(index)}
        loading={loading}
      >
        <CreditCard className="h-4 w-4" />
        Comprar
      </Button>
    </div>
  );
}

function CostRow({ label, cost }: { label: string; cost: string }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <Badge variant="warning" className="font-mono text-xs">
        {cost}
      </Badge>
    </div>
  );
}

export default function Credits() {
  const { credits } = useCreditsBalance();
  const { toast } = useUiStore();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const { data: packagesData } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: () => creditService.getPackages(),
  });

  const packages = packagesData?.packages ?? [];
  const availableProviders = packagesData?.providers ?? [];
  const isMockOnly = availableProviders.length === 1 && availableProviders[0] === 'mock';
  const activeProvider = selectedProvider ?? availableProviders[0] ?? 'mock';

  const buyMutation = useMutation({
    mutationFn: async (idx: number) => {
      const result = await creditService.initiatePayment(idx, activeProvider);

      if (result.checkoutUrl && result.checkoutUrl.startsWith('http')) {
        window.location.href = result.checkoutUrl;
        return null as never;
      }

      const confirmed = await creditService.confirmPayment(result.payment._id);
      return confirmed;
    },
    onSuccess: (payment) => {
      if (!payment) return;
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast.success('Creditos agregados!', `+${payment.creditsAmount} creditos en tu cuenta.`);
    },
    onError: (err: Error) => {
      toast.error('Error en el pago', err.message);
    },
  });

  const isLowCredits = credits < 10;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          Creditos
        </h1>
        <p className="text-muted-foreground mt-1">
          Tus creditos te permiten procesar documentos y generar quizzes
        </p>
      </div>

      {/* Balance */}
      <Card className="overflow-hidden border-yellow-500/20">
        <div className="relative bg-gradient-to-br from-yellow-500/15 via-yellow-500/5 to-transparent">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-20 h-20 bg-yellow-500/5 rounded-full translate-y-1/2" />

          <CardContent className="p-6 sm:p-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="rounded-2xl bg-yellow-500/20 p-4 ring-4 ring-yellow-500/10">
                  <Coins className="h-8 w-8 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tu saldo actual</p>
                  <p className="text-4xl sm:text-5xl font-bold text-yellow-400 tracking-tight">
                    {credits.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">creditos disponibles</p>
                </div>
              </div>

              {isLowCredits && (
                <div className="flex items-start gap-2 bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20 sm:max-w-[220px]">
                  <Gift className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-400/80">
                    Tus creditos estan bajos. Recarga para seguir creando quizzes sin interrupciones.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Quick reference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="rounded-lg bg-blue-500/15 p-2.5">
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Procesar PDF</p>
            <p className="text-xs text-muted-foreground">Desde 5 creditos</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="rounded-lg bg-purple-500/15 p-2.5">
            <Brain className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Generar quiz</p>
            <p className="text-xs text-muted-foreground">Desde 1 credito/pregunta</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="rounded-lg bg-green-500/15 p-2.5">
            <ShieldCheck className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Pago seguro</p>
            <p className="text-xs text-muted-foreground">Sin suscripcion</p>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-semibold">Recargar creditos</h2>
            <p className="text-sm text-muted-foreground">Elige el paquete que mejor se ajuste a ti</p>
          </div>

          {!isMockOnly && availableProviders.length > 0 && (
            <div className="flex items-center gap-2 p-1 rounded-lg border border-white/[0.08] bg-white/[0.03] w-fit">
              {availableProviders.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedProvider(p)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    activeProvider === p
                      ? 'bg-brand-500 text-white shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {PROVIDER_LABELS[p] ?? p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg, idx) => (
            <PackageCard
              key={idx}
              pkg={pkg}
              index={idx}
              onBuy={(i) => buyMutation.mutate(i)}
              loading={buyMutation.isPending}
            />
          ))}
        </div>

        {isMockOnly && (
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Modo demo: los pagos se procesan al instante sin cargo real.
          </p>
        )}
      </div>

      {/* Cost reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-400" />
            Tabla de costos detallada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-blue-400" />
                <p className="font-medium">Procesamiento de PDF</p>
              </div>
              <div className="space-y-0.5">
                {[
                  ['1-10 paginas', '5 cr'],
                  ['11-30 paginas', '10 cr'],
                  ['31-80 paginas', '20 cr'],
                  ['81-150 paginas', '35 cr'],
                  ['151+ paginas', '50 cr'],
                ].map(([label, cost]) => (
                  <CostRow key={label} label={label!} cost={cost!} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-purple-400" />
                <p className="font-medium">Generacion de preguntas</p>
              </div>
              <div className="space-y-0.5">
                {[
                  ['Verdadero/Falso', '1 cr/preg'],
                  ['Opcion multiple', '2 cr/preg'],
                  ['Completar espacios', '2 cr/preg'],
                  ['Seleccion multiple', '3 cr/preg'],
                  ['Respuesta corta', '3 cr/preg'],
                  ['+ Explicaciones', '+1 cr/preg'],
                  ['Dificultad media', 'x1.2'],
                  ['Dificultad dificil', 'x1.5'],
                ].map(([label, cost]) => (
                  <CostRow key={label} label={label!} cost={cost!} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
