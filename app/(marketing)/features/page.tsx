import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutList, Zap, FileText, CheckCircle, Brain, Upload,
  Clock, Target, ArrowRight, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Funcionalidades — Quizzes, Flashcards y Resúmenes con IA',
  description:
    'Descubrí todo lo que podés hacer con StudyAI: quizzes personalizados desde PDFs, flashcards automáticas, resúmenes estructurados y análisis de resultados.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studyai.com'}/features`,
  },
  openGraph: {
    title: 'Funcionalidades de StudyAI — Quizzes, Flashcards y Resúmenes con IA',
    description: 'Toda la potencia de la IA para transformar tus PDFs en material de estudio.',
    type: 'website',
  },
};

const features = [
  {
    icon: LayoutList,
    title: 'Quizzes inteligentes desde PDF',
    description:
      'Subí tu PDF y la IA genera preguntas específicas sobre el contenido. Podés elegir cantidad, dificultad y tipo de pregunta.',
    highlights: [
      'Opción múltiple, V/F, completar espacios y respuesta corta',
      'Hasta 50 preguntas por quiz',
      'Feedback detallado por cada respuesta',
      'Historial de intentos y evolución',
    ],
    badge: 'Más popular',
    color: 'from-blue-500/20 to-brand-500/10',
  },
  {
    icon: Zap,
    title: 'Flashcards automáticas',
    description:
      'Los conceptos, definiciones y términos clave de tu documento se convierten en tarjetas interactivas listas para repasar.',
    highlights: [
      'Generación automática de concepto / definición',
      'Modo estudio con flip de tarjeta',
      'Organizadas por sets de documentos',
      'Ideal para vocabulario y conceptos clave',
    ],
    badge: null,
    color: 'from-yellow-500/20 to-orange-500/10',
  },
  {
    icon: FileText,
    title: 'Resúmenes estructurados',
    description:
      'La IA extrae lo más importante y lo organiza en un resumen claro con secciones, ideas principales y definiciones.',
    highlights: [
      'Estructura jerárquica con títulos y subtítulos',
      'Términos clave destacados',
      'Ideal para primer lectura rápida',
      'Se guarda en tu biblioteca para releer',
    ],
    badge: null,
    color: 'from-green-500/20 to-teal-500/10',
  },
  {
    icon: CheckCircle,
    title: 'Análisis de resultados',
    description:
      'Después de cada quiz recibís un análisis completo de tu desempeño para saber exactamente qué reforzar.',
    highlights: [
      'Puntuación y tiempo por pregunta',
      'Respuestas correctas con explicación',
      'Evolución a lo largo del tiempo',
      'Preguntas falladas para repasar',
    ],
    badge: null,
    color: 'from-purple-500/20 to-pink-500/10',
  },
];

const specs = [
  { label: 'Formatos soportados', value: 'PDF (hasta 50 MB)' },
  { label: 'Idiomas', value: 'Español, inglés y más' },
  { label: 'Tipos de preguntas', value: '5 tipos distintos' },
  { label: 'Preguntas por quiz', value: 'Hasta 50' },
  { label: 'Tiempo de generación', value: 'Menos de 60 segundos' },
  { label: 'Historial', value: 'Ilimitado' },
];

export default function FeaturesPage() {
  return (
    <main className="py-16 md:py-24">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-6">
          <Brain className="h-3.5 w-3.5" />
          Funcionalidades
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Todo lo que necesitás para{' '}
          <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
            estudiar mejor
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Tres herramientas de estudio generadas automáticamente desde tus PDFs.
          Sin configuración, sin formato especial.
        </p>
      </div>

      {/* Feature cards */}
      <div className="max-w-5xl mx-auto px-4 space-y-8 mb-24">
        {features.map((f, i) => (
          <div key={f.title} className={`p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br ${f.color} relative overflow-hidden`}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <f.icon className="h-7 w-7 text-brand-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold">{f.title}</h2>
                  {f.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-medium">
                      {f.badge}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{f.description}</p>
                <ul className="space-y-2">
                  {f.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-brand-400 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Specs table */}
      <div className="max-w-3xl mx-auto px-4 mb-24">
        <h2 className="text-2xl font-bold text-center mb-8">Especificaciones técnicas</h2>
        <div className="rounded-xl border border-white/[0.08] overflow-hidden">
          {specs.map((s, i) => (
            <div key={s.label} className={`flex items-center justify-between px-6 py-4 ${i !== specs.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <span className="text-sm font-medium">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Probalo gratis ahora</h2>
        <p className="text-muted-foreground mb-8">
          Creá tu cuenta y subí tu primer PDF. Los primeros créditos son gratis.
        </p>
        <Link href="/login">
          <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white px-10">
            Empezar gratis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
