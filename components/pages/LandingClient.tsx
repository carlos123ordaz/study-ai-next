'use client';

// This is the Landing page component, fully migrated from src/pages/Landing.tsx
// All react-router-dom imports replaced with next/link and next/navigation

import Link from 'next/link';
import {
  BookOpen, Brain, Zap, CheckCircle, Upload, ArrowRight, Sparkles,
  FileText, LayoutList, Clock, Shield, ChevronRight, Star, TrendingUp, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

// ─── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01', icon: Upload, title: 'Sube tu material',
    description: 'PDF de clases, apuntes escaneados o libro de texto. Lo que ya tenés, sin formato especial.',
    detail: 'Soporta PDFs hasta 50 MB',
  },
  {
    number: '02', icon: Brain, title: 'La IA lo convierte',
    description: 'StudyAI lee tu documento y genera quizzes, flashcards y resúmenes basados en tu contenido.',
    detail: 'Listo en menos de 60 segundos',
  },
  {
    number: '03', icon: Target, title: 'Estudia y mide',
    description: 'Respondé el quiz, revisá tus errores y reforzá exactamente lo que falló.',
    detail: 'Con feedback por cada pregunta',
  },
];

const features = [
  {
    icon: LayoutList, title: 'Quizzes personalizados',
    description: 'La IA genera preguntas basadas exclusivamente en tu PDF. Elegís la cantidad, la dificultad y el tipo.',
    badge: 'Feature principal',
    types: [
      { label: 'Opción múltiple', color: 'bg-blue-500/15 text-blue-400' },
      { label: 'Selección múltiple', color: 'bg-purple-500/15 text-purple-400' },
      { label: 'Verdadero/Falso', color: 'bg-green-500/15 text-green-400' },
      { label: 'Completar espacios', color: 'bg-yellow-500/15 text-yellow-400' },
      { label: 'Respuesta corta', color: 'bg-pink-500/15 text-pink-400' },
    ],
    featured: true,
  },
  {
    icon: Zap, title: 'Flashcards automáticas',
    description: 'Los conceptos clave de tus apuntes convertidos en tarjetas para memorización rápida.',
    badge: null, types: [], featured: false,
  },
  {
    icon: FileText, title: 'Resúmenes estructurados',
    description: 'La IA extrae los puntos más importantes con estructura clara: títulos, conceptos, definiciones.',
    badge: null, types: [], featured: false,
  },
  {
    icon: CheckCircle, title: 'Resultados detallados',
    description: 'Cada quiz termina con tu puntuación, las respuestas correctas y una explicación de cada una.',
    badge: null, types: [], featured: false,
  },
];

const testimonials = [
  {
    name: 'Sofía M.', role: 'Estudiante de Medicina', avatar: 'SM',
    content: 'Con StudyAI pude repasar todo el temario en la mitad del tiempo. Los quizzes generados desde mis PDFs son increíbles.',
    stars: 5,
  },
  {
    name: 'Lucas R.', role: 'Estudiante de Derecho', avatar: 'LR',
    content: 'Los resúmenes que genera son perfectos. Me ayuda a entender mejor los textos largos y a identificar lo más importante.',
    stars: 5,
  },
  {
    name: 'Valentina G.', role: 'Preparando certificación IT', avatar: 'VG',
    content: 'Las flashcards automáticas son un game changer. Las repaso en el subte y llego al examen mucho más segura.',
    stars: 5,
  },
];

const faqs = [
  {
    question: '¿Qué tipo de archivos puedo subir?',
    answer: 'Actualmente soportamos archivos PDF de hasta 50 MB. Próximamente agregaremos Word, PowerPoint y texto plano.',
  },
  {
    question: '¿Cuánto cuesta usar StudyAI?',
    answer: 'Tenés créditos gratuitos para empezar. Cada acción (quiz, flashcards, resumen) consume créditos según la complejidad. Podés recargar créditos en cualquier momento.',
  },
  {
    question: '¿En qué idiomas funciona?',
    answer: 'StudyAI detecta automáticamente el idioma de tu documento y genera el contenido en ese mismo idioma. Funciona mejor con español e inglés.',
  },
  {
    question: '¿Mis documentos están seguros?',
    answer: 'Sí. Tus PDFs se procesan de forma segura y no los compartimos con terceros. Podés eliminar tus documentos en cualquier momento desde tu cuenta.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function LandingClient() {
  const { isAuthenticated } = useAuthStore();

  const handleLogin = async () => {
    const url = await authService.getGoogleLoginUrl();
    window.location.href = url;
  };

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Potenciado por IA
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Convierte tus PDFs en{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              material de estudio inteligente
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Sube tus apuntes o libros en PDF y StudyAI genera automáticamente quizzes
            personalizados, flashcards y resúmenes estructurados. Estudiá más en menos tiempo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white px-8">
                  Ir al Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                className="bg-brand-500 hover:bg-brand-600 text-white px-8"
                onClick={handleLogin}
              >
                Empezar gratis con Google
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Link href="/features">
              <Button size="lg" variant="outline">
                Ver funcionalidades
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Sin tarjeta de crédito · Créditos gratuitos para empezar
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">¿Cómo funciona?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tres pasos y ya estás estudiando con IA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-brand-400" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-brand-400/60 font-bold">{step.number}</span>
                    <h3 className="font-semibold text-base mt-0.5 mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <span className="inline-flex items-center text-xs text-muted-foreground gap-1">
                      <Clock className="h-3 w-3" />
                      {step.detail}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Todo lo que necesitás para estudiar</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tres herramientas de estudio generadas automáticamente desde tu material.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`p-6 rounded-xl border ${feature.featured ? 'border-brand-500/30 bg-brand-500/5' : 'border-white/[0.08] bg-card'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/15 flex items-center justify-center shrink-0">
                    <feature.icon className="h-5 w-5 text-brand-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{feature.title}</h3>
                      {feature.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-medium">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    {feature.types.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {feature.types.map((t) => (
                          <span key={t.label} className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.color}`}>
                            {t.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Lo que dicen los estudiantes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-xl border border-white/[0.08] bg-card">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Preguntas frecuentes</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-white/[0.08] rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-8">
            <Link href="/faq" className="text-brand-400 hover:text-brand-300 text-sm font-medium inline-flex items-center gap-1">
              Ver todas las preguntas <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-6">
            <TrendingUp className="h-3.5 w-3.5" />
            Más de 500 estudiantes ya lo usan
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Empezá a estudiar más inteligente hoy
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Creá tu cuenta gratis y subí tu primer PDF en menos de 2 minutos.
          </p>
          <Button
            size="lg"
            className="bg-brand-500 hover:bg-brand-600 text-white px-10"
            onClick={handleLogin}
          >
            Crear cuenta gratis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-3">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Seguro</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Sin tarjeta de crédito</span>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-brand-500 p-1">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-brand-400">StudyAI</span>
          </div>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/features" className="hover:text-foreground transition-colors">Funcionalidades</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Precios</Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          </nav>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} StudyAI</p>
        </div>
      </footer>
    </main>
  );
}
