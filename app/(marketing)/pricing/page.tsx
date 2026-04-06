import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Coins, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Precios — Créditos y planes de StudyAI',
  description:
    'StudyAI funciona con créditos. Empezá gratis y recargá cuando quieras. Sin suscripciones ni compromisos. Pagá solo lo que usás.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studyai.com'}/pricing`,
  },
  openGraph: {
    title: 'Precios de StudyAI — Sin suscripciones, pagás lo que usás',
    description: 'Empezá gratis con créditos incluidos. Recargá cuando necesites.',
    type: 'website',
  },
};

// JSON-LD for pricing
function PricingJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'PriceSpecification',
          name: 'StudyAI Créditos',
          description: 'Sistema de créditos para generar material de estudio con IA',
          priceCurrency: 'ARS',
        }),
      }}
    />
  );
}

const creditPacks = [
  {
    name: 'Starter',
    credits: 1000,
    price: 'Gratis',
    priceNote: 'Al registrarte',
    highlight: false,
    features: [
      '~5 quizzes de 20 preguntas',
      '~10 sets de flashcards',
      '~10 resúmenes',
      'Sin vencimiento',
    ],
  },
  {
    name: 'Plus',
    credits: 5000,
    price: '$1.500',
    priceNote: 'ARS / única vez',
    highlight: true,
    features: [
      '~25 quizzes de 20 preguntas',
      '~50 sets de flashcards',
      '~50 resúmenes',
      'Sin vencimiento',
    ],
  },
  {
    name: 'Pro',
    credits: 15000,
    price: '$3.500',
    priceNote: 'ARS / única vez',
    highlight: false,
    features: [
      '~75 quizzes de 20 preguntas',
      '~150 sets de flashcards',
      '~150 resúmenes',
      'Sin vencimiento',
    ],
  },
];

const costs = [
  { action: 'Quiz (10 preguntas)', cost: '8–12 créditos', note: 'Según dificultad' },
  { action: 'Quiz (20 preguntas)', cost: '15–20 créditos', note: '' },
  { action: 'Quiz (50 preguntas)', cost: '35–50 créditos', note: '' },
  { action: 'Set de flashcards', cost: '8–12 créditos', note: '' },
  { action: 'Resumen de documento', cost: '8–12 créditos', note: '' },
];

export default function PricingPage() {
  return (
    <>
      <PricingJsonLd />
      <main className="py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto px-4 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-6">
            <Coins className="h-3.5 w-3.5" />
            Precios
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sin suscripciones.{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              Pagás lo que usás.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            StudyAI funciona con créditos. Empezá gratis, recargá cuando quieras.
            Los créditos no vencen.
          </p>
        </div>

        {/* Plans */}
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6 mb-20">
          {creditPacks.map((pack) => (
            <div
              key={pack.name}
              className={`p-6 rounded-2xl border ${pack.highlight
                ? 'border-brand-500/50 bg-brand-500/5 ring-1 ring-brand-500/20'
                : 'border-white/[0.08] bg-card'}`}
            >
              {pack.highlight && (
                <div className="text-xs font-medium text-brand-400 bg-brand-500/15 px-2 py-0.5 rounded-full inline-block mb-3">
                  Más popular
                </div>
              )}
              <h2 className="text-xl font-bold mb-1">{pack.name}</h2>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold">{pack.price}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{pack.priceNote}</p>
              <div className="flex items-center gap-2 mb-5 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Coins className="h-5 w-5 text-yellow-400" />
                <span className="font-bold text-lg">{pack.credits}</span>
                <span className="text-sm text-muted-foreground">créditos</span>
              </div>
              <ul className="space-y-2 mb-6">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-brand-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button
                  className={`w-full ${pack.highlight ? 'bg-brand-500 hover:bg-brand-600 text-white' : ''}`}
                  variant={pack.highlight ? 'default' : 'outline'}
                >
                  {pack.price === 'Gratis' ? 'Empezar gratis' : 'Comprar'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Cost table */}
        <div className="max-w-2xl mx-auto px-4 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            ¿Cuántos créditos consume cada acción?
          </h2>
          <div className="rounded-xl border border-white/[0.08] overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-3 bg-white/[0.03] border-b border-white/[0.06]">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Acción</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Créditos</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nota</span>
            </div>
            {costs.map((c, i) => (
              <div key={c.action} className={`grid grid-cols-3 px-6 py-4 ${i !== costs.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                <span className="text-sm">{c.action}</span>
                <span className="text-sm font-medium text-brand-400">{c.cost}</span>
                <span className="text-sm text-muted-foreground">{c.note}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            El costo exacto se estima antes de confirmar. Nunca se descuentan más créditos de lo indicado.
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Preguntas sobre precios</h2>
          <div className="space-y-4">
            {[
              {
                q: '¿Los créditos tienen vencimiento?',
                a: 'No. Los créditos que comprás o ganás no expiran nunca.',
              },
              {
                q: '¿Puedo pedir reembolso?',
                a: 'Sí, dentro de las 24 horas de la compra si no usaste los créditos.',
              },
              {
                q: '¿Qué pasa si me quedan créditos?',
                a: 'Se acumulan. No hay límite de acumulación.',
              },
            ].map((item) => (
              <div key={item.q} className="p-5 rounded-xl border border-white/[0.08] bg-card">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-400 shrink-0" />
                  {item.q}
                </h3>
                <p className="text-sm text-muted-foreground pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
